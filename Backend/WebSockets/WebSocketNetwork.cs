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

    WebSocketLink connection = new WebSocketLink(userId, webSocket);
    connection.Disconnected += OnDisconnectedAsync;
    connection.FriendRequest += OnFriendRequestAsync;

    _connections.Add(connection);
    _semaphore.Release();

    await OnConnectedAsync(connection);

    return connection;
  }

  private async Task OnDisconnectedAsync(WebSocketLink disconnectedHandler)
  {
    await _semaphore.WaitAsync();

    disconnectedHandler.Disconnected -= OnDisconnectedAsync;
    disconnectedHandler.FriendRequest -= OnFriendRequestAsync;

    _connections.Remove(disconnectedHandler);
    _semaphore.Release();
  }

  private async Task OnConnectedAsync(WebSocketLink connectedUser)
  {
    await GetMenuData(connectedUser);
    await _friendshipSystem.GetFriendlist(connectedUser, _connections.ToArray());
  }

  private Task OnFriendRequestAsync(WebSocketLink userHandler, string jsonObject)
  {
    FriendRequest request = JsonSerializer.Deserialize<FriendRequest>(jsonObject);

		List<Task> tasks = new List<Task>();
		WebSocketLink[] handlers = _connections.ToArray();

    //SEGUIR

		return Task.WhenAll(tasks);
	}

  //SUBMETODOS
  private Task GetMenuData(WebSocketLink newHandler)
  {
    List<Task> tasks = new();
    WebSocketLink[] handlers = _connections.ToArray();

    MenuData menuData = new()
    {
      OnlineUsers = handlers.Length,
      PlayingUsers = 0, //CAMBIAR
      CurrentMatches = 0 //CAMBIAR
    };

    foreach (WebSocketLink handler in handlers)
    {
      tasks.Add(handler.SendAsync(JsonSerializer.Serialize(menuData)));
    }

    return Task.WhenAll(tasks);
  }
}

