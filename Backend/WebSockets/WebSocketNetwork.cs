using System.Net.WebSockets;

namespace Backend.WebSockets;

public class WebSocketNetwork
{
  private static int _onlineUsersCounter = 0;
  private readonly List<WebSocketHandler> _handlers = [];
  private readonly SemaphoreSlim _semaphore = new(1, 1);

  public async Task HandleAsync(WebSocket webSocket)
  {
    WebSocketHandler handler = await AddWebsocketAsync(webSocket);

    //FUNCIONES EJECUTADAS AL CONECTAR
    await GetMenuData(handler);

    await handler.HandleAsync();
  }

  private async Task<WebSocketHandler> AddWebsocketAsync(WebSocket webSocket)
  {
    await _semaphore.WaitAsync();

    WebSocketHandler handler = new WebSocketHandler(_onlineUsersCounter, webSocket);
    handler.Disconnected += OnDisconnectedAsync;

   

    _handlers.Add(handler);
    _onlineUsersCounter++;
    _semaphore.Release();

    return handler;
  }

  private async Task OnDisconnectedAsync(WebSocketHandler disconnectedHandler)
  {
    await _semaphore.WaitAsync();

    disconnectedHandler.Disconnected -= OnDisconnectedAsync;
   
    _handlers.Remove(disconnectedHandler);

    _semaphore.Release();

    List<Task> tasks = new List<Task>();
    
    WebSocketHandler[] handlers = _handlers.ToArray();

    //FUNCIONALIDAD AL CONECTAR

    await Task.WhenAll(tasks);
  }
    
  private Task GetMenuData(WebSocketHandler newHandler) 
  {
        List<Task> tasks = [];
        WebSocketHandler[] handlers = [];

        foreach (WebSocketHandler handler in handlers)
        {
            tasks.Add(handler.SendAsync($"{_onlineUsersCounter}"));
        }

        return Task.WhenAll(tasks);
    }
}