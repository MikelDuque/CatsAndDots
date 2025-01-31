using System.Net.WebSockets;
using System.Text.Json;
using Backend.WebSockets.Messages;
using Backend.WebSockets.Systems;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private readonly HashSet<WebSocketLink> _connections = [];
  private readonly SemaphoreSlim _semaphore = new(10);

  private readonly UserSystem _userSystem;
  private readonly FriendshipSystem _friendshipSystem;

  public WebSocketNetwork(IServiceScopeFactory scopeFactory)
  {
    _friendshipSystem = new FriendshipSystem(scopeFactory);
    _userSystem = new UserSystem(scopeFactory);
  }

  public async Task HandleAsync(WebSocket webSocket, long userId)
  {
    WebSocketLink connection = await AddWebsocketAsync(webSocket, userId);

    await connection.HandleEventAsync();
  }

  private async Task<WebSocketLink> AddWebsocketAsync(WebSocket webSocket, long userId)
  {
    await _semaphore.WaitAsync();

    WebSocketLink newConnection = new(userId, webSocket);
		newConnection.FriendRequest += OnFriendRequestAsync;
		newConnection.Disconnected += OnDisconnectedAsync;

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
		await _userSystem.OnDisconnectedAsync(disconnectedUser, _connections.ToArray());

		_semaphore.Release();
  }

  private async Task OnConnectedAsync(WebSocketLink connectedUser)
  {
    await _userSystem.OnConnectedAsync(connectedUser, _connections.ToArray());
  }

  private async Task OnFriendRequestAsync(WebSocketLink connectedUser, string message)
  {
    FriendRequestMessage request = JsonSerializer.Deserialize<FriendRequestMessage>(message);

		await _friendshipSystem.ChangeFriendship(_connections.ToArray(), connectedUser, request.Body);
	}
  
}

