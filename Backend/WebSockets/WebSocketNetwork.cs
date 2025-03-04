using System.Net.WebSockets;
using System.Text.Json;
using Backend.Game;
using Backend.Helpers;
using Backend.Models;
using Backend.WebSockets.Messages;
using Backend.WebSockets.Systems;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private readonly Dictionary<long, long> _activeMatches = new();
  private readonly HashSet<WebSocketLink> _connections = [];
  private readonly SemaphoreSlim _semaphore = new(5);

  private readonly UserSystem _userSystem;
  private readonly FriendshipSystem _friendshipSystem;
  private readonly MatchmakingSystem _matchmakingSystem;

  public int ActiveMatchesCount => _activeMatches.Count;

  public WebSocketNetwork(IServiceScopeFactory scopeFactory)
  {
    _friendshipSystem = new FriendshipSystem(scopeFactory, _connections);
    _userSystem = new UserSystem(scopeFactory, _connections, this);
    _matchmakingSystem = new MatchmakingSystem(this);
  }

  public async Task HandleAsync(WebSocket webSocket, long userId)
  {
    WebSocketLink connection = await AddWebsocketAsync(webSocket, userId);

    await connection.HandleEventAsync();
  }

  public WebSocketLink GetConnectedUser(long id) {
		return _connections.Where(user => user.Id == id).FirstOrDefault();
	}

  private async Task<WebSocketLink> AddWebsocketAsync(WebSocket webSocket, long userId)
  {
    await _semaphore.WaitAsync();

    WebSocketLink newConnection = new(userId, webSocket);
		newConnection.FriendRequest += OnFriendRequestAsync;
		newConnection.Disconnected += OnDisconnectedAsync;
    newConnection.MatchmakingEvent += OnMatchmakingAsync;
    newConnection.GameBotEvent += OnGameBotEventAsync;


    _connections.Add(newConnection);
    _semaphore.Release();

    await OnConnectedAsync(newConnection);

    return newConnection;
  }

  private async Task OnDisconnectedAsync(WebSocketLink disconnectedUser)
  {
    await _semaphore.WaitAsync();

		disconnectedUser.FriendRequest -= OnFriendRequestAsync;
		disconnectedUser.Disconnected -= OnDisconnectedAsync;    

    _connections.Remove(disconnectedUser);

    if (_activeMatches.ContainsKey(disconnectedUser.Id))
    {
      long opponentId = _activeMatches[disconnectedUser.Id];
      _activeMatches.Remove(disconnectedUser.Id);

      WebSocketLink opponent = GetConnectedUser(opponentId);
      if (opponent != null)
      {
        opponent.ConnectionState = ConnectionState.Online;
        await _userSystem.UpdateUserData(opponent.Id, ConnectionState.Online);
        await opponent.SendAsync(ParseHelper.GenericMessage("MatchCancelled", "Tu oponente se ha desconectado."));
      }
    }
    else if (_activeMatches.ContainsValue(disconnectedUser.Id))
    {
      long hostId = _activeMatches.FirstOrDefault(x => x.Value == disconnectedUser.Id).Key;
      _activeMatches.Remove(hostId);

      WebSocketLink host = GetConnectedUser(hostId);
      if (host != null)
      {
        host.ConnectionState = ConnectionState.Online;
        await _userSystem.UpdateUserData(host.Id, ConnectionState.Online);
        await host.SendAsync(ParseHelper.GenericMessage("MatchCancelled", "Tu oponente se ha desconectado."));
      }
    }

    await _userSystem.ConnectionChangeAsync(disconnectedUser, ConnectionState.Offline);

		_semaphore.Release();
  }

  private async Task OnConnectedAsync(WebSocketLink connectedUser)
  {
    await _userSystem.ConnectionChangeAsync(connectedUser, ConnectionState.Online);
  }

  private async Task OnFriendRequestAsync(WebSocketLink connectedUser, string message)
  {
    FriendRequestMessage request = JsonSerializer.Deserialize<FriendRequestMessage>(message);

		await _friendshipSystem.ChangeFriendship(_connections.ToArray(), connectedUser, request.Body);
	}
 
  private async Task OnMatchmakingAsync(WebSocketLink connectedUser, string message)
  {
    await _matchmakingSystem.HandleMatchmakingAsync(connectedUser, message);
  }

  public async Task StartMatchAsync(long hostId, long guestId)
  {
    WebSocketLink host = GetConnectedUser(hostId);
    WebSocketLink guest = GetConnectedUser(guestId);

    if (host != null && guest != null)
    {
      _activeMatches[hostId] = guestId;

      await _userSystem.UpdateUserData(hostId, ConnectionState.Playing);
      await _userSystem.UpdateUserData(guestId, ConnectionState.Playing);

    }
  }

  private async Task OnGameBotEventAsync(WebSocketLink connectedUser, string message)
  {
    GameClass game = new("Jugador", "Bot", true);
    await connectedUser.SendAsync(ParseHelper.GenericMessage("GameStarted", "Has iniciado una partida contra el bot."));

    do
    {
      Player currentPlayer = game.IsFirstPlayerMove ? game.Player1 : game.Player2;

      if (currentPlayer.isBot)
      {
        game.PlayTurn(0,0,0);
        await connectedUser.SendAsync(ParseHelper.GenericMessage("BotMove", "El bot ha jugado."));

      }
      else
      {
        await connectedUser.SendAsync(ParseHelper.GenericMessage("PlayerMove", "Es tu turno. Env�a tu jugada."));

        string playerMoveMessage;
        do
        {
          playerMoveMessage = await connectedUser.ReadAsync();
          Console.WriteLine($"Esperando jugada del jugador... Recibido: {playerMoveMessage}");
        } while (string.IsNullOrWhiteSpace(playerMoveMessage));

        var playerMoveData = ParseHelper.ParseMove(playerMoveMessage);

        game.PlayTurn(playerMoveData.TipoLinea, playerMoveData.Num1, playerMoveData.Num2);
        var moveData = new
        {
          tipoLinea = playerMoveData.TipoLinea,
          num1 = playerMoveData.Num1,
          num2 = playerMoveData.Num2,
          jugador = currentPlayer.Name
        };
        await connectedUser.SendAsync(ParseHelper.GenericMessage("MoveConfirmed", JsonSerializer.Serialize(moveData)));


      }

    } while (!game.IsGameOver());

    string winner = game.GetWinner();
    await connectedUser.SendAsync(ParseHelper.GenericMessage("GameOver", $"Partida finalizada. Ganador: {winner}"));
  }

}

