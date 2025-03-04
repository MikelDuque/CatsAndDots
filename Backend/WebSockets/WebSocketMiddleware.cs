using System.Diagnostics;
using Microsoft.AspNetCore.Authentication;

namespace Backend.WebSockets;

public class WebSocketMiddleware : IMiddleware
{
	public Task InvokeAsync(HttpContext context, RequestDelegate next)
	{
		if (context.WebSockets.IsWebSocketRequest)
		{
			string token = context.Request.Query["accessToken"];

			if (!string.IsNullOrEmpty(token))
			{
				context.Request.Headers.Authorization = "Bearer " + token;
			} else
			{
				Task.FromResult(AuthenticateResult.Fail("Invalid Credentials"));
			}
		}
		return next(context);
	}
};