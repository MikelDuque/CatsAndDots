using Backend.Services;
using Backend.WebSockets;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Net.WebSockets;

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
		string token = await HttpContext.GetTokenAsync("access_token");

		try
		{
			long userId = await _authService.GetUserIdFromToken(token);
			await _websocketNetwork.HandleAsync(webSocket, userId);
		}
		catch (SecurityTokenValidationException)
		{
			HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
		}
		catch (Exception)
		{
			HttpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
		}
	}
}
