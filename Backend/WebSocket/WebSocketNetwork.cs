using Backend.Services;

namespace Backend.WebSocket;

public class WebSocketNetwork
{
  private static int _onlineUsersCounter = 0;
  private readonly List<WebSocketHandler> _handlers = new List<WebSocketHandler>();
}
