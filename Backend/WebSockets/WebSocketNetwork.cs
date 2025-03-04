using System.Diagnostics;
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
  private readonly HashSet<WebSocketLink> _connections = [];
  private readonly Dictionary<long, long> _activeMatches = [];  //Esto habrá que revistarlo cuando llegue el momento
  private readonly SemaphoreSlim _semaphore = new(1, 10);

  private readonly UserSystem _userSystem;
  private readonly RequestSystem _requestSystem;
  private readonly LobbySystem _lobbySystem;

  public WebSocketNetwork(IServiceScopeFactory scopeFactory)
  {
    _userSystem = new UserSystem(scopeFactory, _connections, _activeMatches.Count);
    _requestSystem = new RequestSystem(scopeFactory, _connections);
    //_lobbySystem = new LobbySystem(this);
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
    newConnection.Disconnected += OnDisconnectedAsync;
		newConnection.FriendRequest += OnFriendRequestAsync;
    newConnection.MatchmakingRequest += OnMatchmakingAsync;
    newConnection.GameBotEvent += OnGameBotEventAsync;


    _connections.Add(newConnection);
		_semaphore.Release();

		await _userSystem.ConnectionChangeAsync(newConnection, ConnectionState.Online);

		return newConnection;
  }

  private async Task OnDisconnectedAsync(WebSocketLink disconnectedUser)
  {
    await _semaphore.WaitAsync();

		disconnectedUser.FriendRequest -= OnFriendRequestAsync;
    disconnectedUser.MatchmakingRequest -= OnMatchmakingAsync;
		disconnectedUser.GameBotEvent -= OnGameBotEventAsync;
		disconnectedUser.Disconnected -= OnDisconnectedAsync;
    disconnectedUser.Dispose();

		_connections.Remove(disconnectedUser);
		_semaphore.Release();

		await _userSystem.ConnectionChangeAsync(disconnectedUser, ConnectionState.Offline);
	}

  private async Task OnFriendRequestAsync(WebSocketLink connectedUser, string message)
  {
    FriendRequestMessage request = ParseHelper.DesMessage<FriendRequestMessage>(message);

		await _requestSystem.HandleFriendship(request.Body);
	}
 
  private async Task OnMatchmakingAsync(WebSocketLink connectedUser, string message)
  {
    MatchmakingMessage matchmaking = ParseHelper.DesMessage<MatchmakingMessage>(message);

    await _requestSystem.HandleMatchmaking(matchmaking.Body);
  }

  /*
  private async Task OnLobbyAsync()
  {

  }
  */


/* CODIGO DE FERNANDO sacado del "OnDisconected" */

// if (_activeMatches.ContainsKey(disconnectedUser.Id))
// {
//   long opponentId = _activeMatches[disconnectedUser.Id];
//   _activeMatches.Remove(disconnectedUser.Id);

//   WebSocketLink opponent = GetConnectedUser(opponentId);
//   if (opponent != null)
//   {
//     opponent.ConnectionState = ConnectionState.Online;
//     await _userSystem.UpdateUserData(opponent.Id, ConnectionState.Online);
//     await opponent.SendAsync(ParseHelper.GenericMessage("MatchCancelled", "Tu oponente se ha desconectado."));
//   }
// }
// else if (_activeMatches.ContainsValue(disconnectedUser.Id))
// {
//   long hostId = _activeMatches.FirstOrDefault(x => x.Value == disconnectedUser.Id).Key;
//   _activeMatches.Remove(hostId);

//   WebSocketLink host = GetConnectedUser(hostId);
//   if (host != null)
//   {
//     host.ConnectionState = ConnectionState.Online;
//     await _userSystem.UpdateUserData(host.Id, ConnectionState.Online);
//     await host.SendAsync(ParseHelper.GenericMessage("MatchCancelled", "Tu oponente se ha desconectado."));
//   }
// }


/* CÓDIGO DE FERNANDO */

// public async Task StartMatchAsync(long hostId, long guestId)
// {
//   WebSocketLink host = GetConnectedUser(hostId);
//   WebSocketLink guest = GetConnectedUser(guestId);

//   if (host != null && guest != null)
//   {
//     _activeMatches[hostId] = guestId;

//     await _userSystem.UpdateUserData(hostId, ConnectionState.Playing);
//     await _userSystem.UpdateUserData(guestId, ConnectionState.Playing);

//    }
//  }

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

