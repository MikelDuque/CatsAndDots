using System.Net.WebSockets;
using System.Text.Json;
using Backend.Helpers;
using Backend.Models;
using Backend.WebSockets.Messages;
using Backend.WebSockets.Systems;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private readonly HashSet<WebSocketLink> _connections = [];
    private readonly Dictionary<long, long> _activeMatches = [];  //Esto habrá que revistarlo cuando llegue el momento
  private readonly SemaphoreSlim _semaphore = new(5);

  private readonly UserSystem _userSystem;
  private readonly RequestSystem _requestSystem;
  private readonly LobbySystem _lobbySystem;

  public WebSocketNetwork(IServiceScopeFactory scopeFactory)
  {
    _userSystem = new UserSystem(scopeFactory, _connections, _activeMatches.Count);
    _requestSystem = new RequestSystem(scopeFactory, _connections);
    _lobbySystem = new LobbySystem(this);
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
    newConnection.MatchmakingEvent += OnMatchmakingAsync;

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

		await _requestSystem.HandleFriendship(request.Body);
	}
 
  private async Task OnMatchmakingAsync(WebSocketLink connectedUser, string message)
  {
    MatchmakingMessage matchmaking = JsonSerializer.Deserialize<MatchmakingMessage>(message);

    await _requestSystem.HandleMatchmaking(matchmaking.Body);
  }

  private async Task OnLobbyAsync()
  {

  }
}


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

//   }
// }