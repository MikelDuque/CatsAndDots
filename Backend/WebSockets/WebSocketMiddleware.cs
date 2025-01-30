using Backend.Models.Database.Entities;
using System.Security.Claims;
using Backend.Services;
using Microsoft.IdentityModel.Tokens;

namespace Backend.WebSockets;

public class WebSocketMiddleware
{
	private RequestDelegate _next;
	private readonly IServiceScopeFactory _scopeFactory;

	public WebSocketMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
	{
		_next = next;
		_scopeFactory = scopeFactory;
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

		context.Request.Headers["Authorization"] = "Bearer " + token;

		/*

		using (IServiceScope serviceScope = _scopeFactory.CreateScope())
		{
			AuthService authService = serviceScope.ServiceProvider.GetRequiredService<AuthService>();

			try
			{
				//context.Items["UserId"] = await authService.GetUserIdFromToken(token);

				object userId = await authService.GetUserIdFromToken(token);

				//
				object userId = await authService.GetUserIdFromToken(token);
				ClaimsIdentity claimsIdentity = new ClaimsIdentity(new[]
						{
							new Claim("id", userId.ToString())
						}, "Bearer");

				context.User = new ClaimsPrincipal(claimsIdentity);
				//
			}
			catch (SecurityTokenValidationException)
			{
				context.Response.StatusCode = StatusCodes.Status401Unauthorized;
			}
			catch (Exception)
			{
				context.Response.StatusCode = StatusCodes.Status500InternalServerError;
			}
		}
	*/

		//context.Items["Websocket"] = await context.WebSockets.AcceptWebSocketAsync();
		//context.Response.StatusCode = StatusCodes.Status200OK;
		await _next(context);
	}
}
