using Backend.Services;
using Backend.WebSockets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("Websocket")]
[Authorize]
public class WebSocketController : ControllerBase
{
  private readonly WebSocketNetwork _websocketNetwork;
	private readonly AuthService _authService;

	public WebSocketController(WebSocketNetwork webSocketNetwork, AuthService authService) 
  {
    _websocketNetwork = webSocketNetwork;
		_authService = authService;
  }

  [HttpGet]
  public async Task ConnectAsync()
  {
		WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
		long userId = long.Parse(User.FindFirstValue("id"));
   
    Console.WriteLine("Websockt entrante" + webSocket);

		await _websocketNetwork.HandleAsync(webSocket, userId);
	}
}
