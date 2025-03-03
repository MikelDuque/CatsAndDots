using Backend.Services;
using Backend.WebSockets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("Websocket")]
[Authorize]
public class WebSocketController : ControllerBase
{
  private readonly WebSocketNetwork _websocketNetwork;

	public WebSocketController(WebSocketNetwork webSocketNetwork) 
  {
    _websocketNetwork = webSocketNetwork;
  }

  [HttpGet]
  public async Task ConnectAsync()
  {
		WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
		long userId = long.Parse(User.FindFirstValue("id"));

		await _websocketNetwork.HandleAsync(webSocket, userId);
	}
}
