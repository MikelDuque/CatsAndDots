using System.Diagnostics;

namespace Backend.WebSockets;

public class WebSocketMiddleware : IMiddleware
{
	public Task InvokeAsync(HttpContext context, RequestDelegate next)
	{
		if (context.WebSockets.IsWebSocketRequest)
		{
			string token = context.Request.Query["accessToken"];

			context.Request.Headers.Authorization = "Bearer " + token;
		}
		return next(context);
	}
};