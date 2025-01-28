using Backend.WebSockets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;


namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WebSocketController : ControllerBase
{
    private readonly WebSocketNetwork _websocketNetwork;

    public WebSocketController(WebSocketNetwork webSocketNetwork) 
    {
        _websocketNetwork = webSocketNetwork;
    }

    [HttpGet("{id}")]
    public async Task ConnectAsync(long id)
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await _websocketNetwork.HandleAsync(webSocket, id);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
}
