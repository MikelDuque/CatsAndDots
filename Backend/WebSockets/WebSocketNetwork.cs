using System.Net.WebSockets;
using System.Text.Json;
using Backend.Models.DTOs;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private readonly List<WebSocketLink> _connections = new();
  private readonly SemaphoreSlim _semaphore = new(1, 1);
  private readonly FriendshipSystem _friendshipSystem;

  public WebSocketNetwork(IServiceScopeFactory scopeFactory)
  {
    _friendshipSystem = new FriendshipSystem(scopeFactory);
  }

  public async Task HandleAsync(WebSocket webSocket, long userId)
  {
    WebSocketLink connection = await AddWebsocketAsync(webSocket, userId);

    await connection.HandleEventAsync();
  }

  private async Task<WebSocketLink> AddWebsocketAsync(WebSocket webSocket, long userId)
  {
    await _semaphore.WaitAsync();

    WebSocketLink newConnection = new WebSocketLink(userId, webSocket);
    newConnection.Disconnected += OnDisconnectedAsync;
    newConnection.FriendRequest += OnFriendRequestAsync;

    _connections.Add(newConnection);
    _semaphore.Release();

    await OnConnectedAsync(newConnection);

    return newConnection;
  }

  private async Task OnDisconnectedAsync(WebSocketLink disconnectedUser)
  {
    await _semaphore.WaitAsync();

    await _friendshipSystem.UpdateUserData(disconnectedUser.Id, _connections.ToArray());

    disconnectedUser.Disconnected -= OnDisconnectedAsync;
    disconnectedUser.FriendRequest -= OnFriendRequestAsync;

    _connections.Remove(disconnectedUser);
    _semaphore.Release();
  }

  private async Task OnConnectedAsync(WebSocketLink connectedUser)
  {
    await GetMenuData();
    await _friendshipSystem.OnConnectFriendData(connectedUser, _connections.ToArray());
  }

  private Task OnFriendRequestAsync(WebSocketLink connection, string message)
  {
    FriendRequest request = JsonSerializer.Deserialize<FriendRequest>(message);

		List<Task> tasks = new List<Task>();
		WebSocketLink[] handlers = _connections.ToArray();

    //SEGUIR

		return Task.WhenAll(tasks);
	}

  //SUBMETODOS
  private Task GetMenuData()
  {
    List<Task> tasks = new();
    WebSocketLink[] connections = _connections.ToArray();

    MenuData menuData = new()
    {
      OnlineUsers = connections.Length,
      PlayingUsers = 0, //CAMBIAR
      CurrentMatches = 0 //CAMBIAR
    };

    foreach (WebSocketLink user in connections)
    {
      tasks.Add(user.SendAsync(JsonSerializer.Serialize(menuData)));
    }

    return Task.WhenAll(tasks);
  }
}

