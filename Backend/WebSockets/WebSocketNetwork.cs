using System.Net.WebSockets;
using System.Text.Json;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private readonly List<WebSocketHandler> _handlers = new();
  private readonly SemaphoreSlim _semaphore = new(1, 1);
  private readonly IServiceProvider _serviceProvider;

  public WebSocketNetwork(IServiceProvider serviceProvider)
  {
    _serviceProvider = serviceProvider;
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

    _handlers.Add(handler);
    _semaphore.Release();

    await OnConnectedAsync(handler);

    return handler;
  }

  private async Task OnDisconnectedAsync(WebSocketHandler disconnectedHandler)
  {
    await _semaphore.WaitAsync();

    disconnectedHandler.Disconnected -= OnDisconnectedAsync;
    _handlers.Remove(disconnectedHandler);
    _semaphore.Release();

    using var scope = _serviceProvider.CreateScope();
    var userService = scope.ServiceProvider.GetRequiredService<UserService>();

    await userService.ChangeUserState(disconnectedHandler.Id, Models.UserState.Offline);
  }

  private async Task OnConnectedAsync(WebSocketHandler connectedHandler)
  {
    using var scope = _serviceProvider.CreateScope();
    var userService = scope.ServiceProvider.GetRequiredService<UserService>();
    var friendshipService = scope.ServiceProvider.GetRequiredService<FriendshipService>();

    await userService.ChangeUserState(connectedHandler.Id, Models.UserState.Online);
    await GetMenuData(connectedHandler);
    await GetFriendlist(connectedHandler, friendshipService);
  }

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

  private async Task GetFriendlist(WebSocketHandler newHandler, FriendshipService friendshipService)
  {
    List<Task> tasks = new();
    IEnumerable<FriendDto> friendList = await friendshipService.GetFriendList(newHandler.Id);

    foreach (WebSocketHandler handler in _handlers)
    {
      tasks.Add(handler.SendAsync(JsonSerializer.Serialize(friendList)));
    }

    await Task.WhenAll(tasks);
  }
}
