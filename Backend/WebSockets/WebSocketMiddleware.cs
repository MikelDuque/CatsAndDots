namespace Backend.WebSockets;

public class WebSocketMiddleware
{
	private RequestDelegate _next;

	public WebSocketMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		if (context.WebSockets.IsWebSocketRequest)
		{
			string token = context.Request.Query["accessToken"];

			context.Request.Headers.Authorization = "Bearer " + token;
		}

		await _next(context);
	}
}