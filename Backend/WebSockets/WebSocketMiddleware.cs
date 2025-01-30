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
		if (!context.WebSockets.IsWebSocketRequest)
		{
			await _next(context);
			return;
		}
		
		string token = context.Request.Query["accessToken"];

		if (string.IsNullOrEmpty(token))
		{
			context.Response.StatusCode = StatusCodes.Status400BadRequest;
			return;
		}

		context.Request.Headers.Authorization = "Bearer " + token;
		await _next(context);
	}
}
