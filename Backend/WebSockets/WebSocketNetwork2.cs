using System.Net.WebSockets;
using System.Text.Json;
using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using Backend.Services;

namespace Backend.WebSockets;

public class WebSocketNetwork2
{
  private readonly List<WebSocketHandler2> _handlers = new();
  private readonly SemaphoreSlim _semaphore = new(1, 1);
  private readonly IServiceScopeFactory _scopeFactory;

  public WebSocketNetwork2(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
  }

  public async Task HandleAsync(WebSocket webSocket, long userId)
  {
    WebSocketHandler2 handler = await AddWebsocketAsync(webSocket, userId);
    await handler.HandleAsync();
  }

  private async Task<WebSocketHandler2> AddWebsocketAsync(WebSocket webSocket, long userId)
  {
    await _semaphore.WaitAsync();

    WebSocketHandler2 handler = new WebSocketHandler2(userId, webSocket);
    handler.Disconnected += OnDisconnectedAsync;

    _handlers.Add(handler);
    _semaphore.Release();

    await OnConnectedAsync(handler);

    return handler;
  }

  private async Task OnDisconnectedAsync(WebSocketHandler2 disconnectedHandler)
  {
    await _semaphore.WaitAsync();

    disconnectedHandler.Disconnected -= OnDisconnectedAsync;
    _handlers.Remove(disconnectedHandler);
    _semaphore.Release();
  }

  private async Task OnConnectedAsync(WebSocketHandler2 connectedHandler)
  {
    await GetMenuData(connectedHandler);
    await HandleFriendlist(connectedHandler);
  }

  private Task GetMenuData(WebSocketHandler2 newHandler)
  {
    List<Task> tasks = new();
    WebSocketHandler2[] handlers = _handlers.ToArray();

    MenuData menuData = new()
    {
      OnlineUsers = handlers.Length,
      PlayingUsers = 0, //CAMBIAR
      CurrentMatches = 0 //CAMBIAR
    };

    foreach (WebSocketHandler2 handler in handlers)
    {
      tasks.Add(handler.SendAsync(JsonSerializer.Serialize(menuData)));
    }

    return Task.WhenAll(tasks);
  }

  private async Task HandleFriendlist(WebSocketHandler2 newHandler)
  {
		List<Task> tasks = new();

		WebSocketHandler2[] handlerFriends = GetFriendList2(newHandler, _handlers.ToArray());

		foreach (WebSocketHandler2 handler in handlerFriends)
    {
			IEnumerable<WebSocketHandler2> handlerFriendList = await GetFriendList2(handler);

			tasks.Add(handler.SendAsync(JsonSerializer.Serialize(handlerFriendList)));
    }

    await Task.WhenAll(tasks);
  }

  //MÉTODOS SCOPED
  private async Task<IEnumerable<WebSocketHandler2>> GetFriendList(WebSocketHandler2 handler, WebSocket webSocket)
  {
    using (IServiceScope serviceScope = _scopeFactory.CreateScope())
    {
      UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
      HandlerMapper mapper = serviceScope.ServiceProvider.GetService<HandlerMapper>();

      User thisUser = await unitOfWork.UserRepository.GetByIdAsync(handler.Id);

      return mapper.ToDto(thisUser.Friends, webSocket);
    }
  }

	private WebSocketHandler2[] GetFriendList2(WebSocketHandler2 handler)
	{
		using (IServiceScope serviceScope = _scopeFactory.CreateScope())
		{
			UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();

      return = unitOfWork.UserRepository.GetByIdAsync(handler.Id).Result?.Friends;

			return handlers.Where(user => friendList.Any(friend => friend.Id == user.Id)).ToArray();
		}
	}
}

