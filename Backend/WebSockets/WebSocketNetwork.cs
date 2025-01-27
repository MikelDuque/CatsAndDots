using System.Net.WebSockets;
using System.Text.Json;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  //private static int _onlineUsersCounter = 0;
  private readonly List<WebSocketHandler> _handlers = [];
  private readonly SemaphoreSlim _semaphore = new(1, 1);

  private readonly UserService _userService;
  private readonly FriendshipService _friendshipService;

  public WebSocketNetwork(FriendshipService friendshipService, UserService userService)
  {
    _friendshipService = friendshipService;
    _userService = userService;
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
    //_onlineUsersCounter++;
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

    await GetMenuData(disconnectedHandler);
		await _userService.ChangeUserState(disconnectedHandler.Id, Models.UserState.Offline);
	}

  private async Task OnConnectedAsync(WebSocketHandler connectedHandler)
  {
    await GetMenuData(connectedHandler);
    await _userService.ChangeUserState(connectedHandler.Id, Models.UserState.Online);
    await GetFriendlist(connectedHandler);
  }

  private Task GetMenuData(WebSocketHandler newHandler)
  {
    List<Task> tasks = [];
    WebSocketHandler[] handlers = _handlers.ToArray();

    MenuData menuData = new MenuData
    {
      OnlineUsers = handlers.Length,
      PlayingUsers = 0, //CAMBIAR
      CurrentMatches = 0  //CAMBIAR
    };

    foreach (WebSocketHandler handler in handlers)
    {
      tasks.Add(handler.SendAsync(JsonSerializer.Serialize(menuData)));
    }

    return Task.WhenAll(tasks);
  }

	private async Task<Task> GetFriendlist(WebSocketHandler newHandler)
	{
		List<Task> tasks = [];
		WebSocketHandler[] handlers = _handlers.ToArray();

    IEnumerable<FriendDto> friendList = await _friendshipService.GetFriendList(newHandler.Id);

		foreach (WebSocketHandler handler in handlers)
		{
			tasks.Add(newHandler.SendAsync(JsonSerializer.Serialize(friendList)));
		}

		return Task.WhenAll(tasks);
	}
}