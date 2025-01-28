using System.Net.WebSockets;
using System.Text.Json;
using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Enums;
using Backend.Models.Mappers;
using Backend.Services;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private readonly List<WebSocketHandler> _handlers = new();
  private readonly SemaphoreSlim _semaphore = new(1, 1);
  private readonly IServiceScopeFactory _scopeFactory;

  public WebSocketNetwork(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
  }

  public async Task HandleAsync(WebSocket webSocket, long userId)
  {
    WebSocketHandler handler = await AddWebsocketAsync(webSocket, userId);

    await handler.HandleAsync();
  }

  private async Task<WebSocketHandler> AddWebsocketAsync(WebSocket webSocket, long userId)
  {
    await _semaphore.WaitAsync();

    WebSocketHandler handler = new WebSocketHandler(userId, webSocket);
    handler.Disconnected += OnDisconnectedAsync;
    handler.FriendRequest += OnFriendRequestAsync;

    _handlers.Add(handler);
    _semaphore.Release();

    await OnConnectedAsync(handler);

    return handler;
  }

  private async Task OnDisconnectedAsync(WebSocketHandler disconnectedHandler)
  {
    await _semaphore.WaitAsync();

    disconnectedHandler.Disconnected -= OnDisconnectedAsync;
    disconnectedHandler.FriendRequest -= OnFriendRequestAsync;

    _handlers.Remove(disconnectedHandler);
    _semaphore.Release();
  }

  private async Task OnConnectedAsync(WebSocketHandler connectedHandler)
  {
    await GetMenuData(connectedHandler);
    await GetFriendlist(connectedHandler);
  }

  private Task OnFriendRequestAsync(WebSocketHandler userHandler, string jsonObject)
  {
    FriendRequest request = JsonSerializer.Deserialize<FriendRequest>(jsonObject);

		List<Task> tasks = new List<Task>();
		WebSocketHandler[] handlers = _handlers.ToArray();

    //SEGUIR

		return Task.WhenAll(tasks);
	}

  //SUBMÉTODOS
  private Task GetMenuData(WebSocketHandler newHandler)
  {
    List<Task> tasks = new();
    WebSocketHandler[] handlers = _handlers.ToArray();

    MenuData menuData = new()
    {
      OnlineUsers = handlers.Length,
      PlayingUsers = 0, //CAMBIAR
      CurrentMatches = 0 //CAMBIAR
    };

    foreach (WebSocketHandler handler in handlers)
    {
      tasks.Add(handler.SendAsync(JsonSerializer.Serialize(menuData)));
    }

    return Task.WhenAll(tasks);
  }

  private async Task GetFriendlist(WebSocketHandler newHandler)
  {
		List<Task> tasks = new();

    IEnumerable<FriendDto> friendList = await GetFriendListScoped(newHandler);

		WebSocketHandler[] handlerFriends = _handlers.Where(handler => friendList.Any(friend => friend.Id == handler.Id)).ToArray();

    foreach (WebSocketHandler handler in handlerFriends)
    {
			IEnumerable<FriendDto> handlerFriendList = await GetFriendListScoped(handler);

			tasks.Add(handler.SendAsync(JsonSerializer.Serialize(handlerFriendList)));
    }

    await Task.WhenAll(tasks);
  }

  //SUBMÉTODOS SCOPED
  private async Task<IEnumerable<FriendDto>> GetFriendListScoped(WebSocketHandler handler)
  {
    using (IServiceScope serviceScope = _scopeFactory.CreateScope())
    {
      FriendshipService friendService = serviceScope.ServiceProvider.GetRequiredService<FriendshipService>();

      return await friendService.GetFriendList(handler);
    }
  }
}

