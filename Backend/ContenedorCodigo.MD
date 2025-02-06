# Cats And Dots
## Contenedor de código reutilizable

### Websocket Middleware
```
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

  using IServiceScope serviceScope = _scopeFactory.CreateScope()
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

  context.Items["Websocket"] = await context.WebSockets.AcceptWebSocketAsync();
  context.Response.StatusCode = StatusCodes.Status200OK;

  await _next(context);
}
```

### Websocket Controller
```
public async Task ConnectAsync()
{
  WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
  string token = await HttpContext.GetTokenAsync("access_token");

  //WebSocket webSocket = (WebSocket)HttpContext.Items["WebSocket"];
  //object userId = HttpContext.Items["UserId"];

  if (HttpContext.WebSockets.IsWebSocketRequest)
  {
    WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
    await _websocketNetwork.HandleAsync(webSocket, 1);
  }
  else
  {
    HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
  }
}
```

### Seeder
```
UserFriendship[] friendships =
  [
		//Mikel y Fer
    new UserFriendship
    {
      UserAId = 2,
      UserBId = 3,
      WhenFriendship = DateTime.Now
    },
		new UserFriendship
		{
			UserAId = 3,
			UserBId = 2,
			WhenFriendship = DateTime.Now
		},

		//Mikel y David
		new UserFriendship
		{
			UserAId = 2,
			UserBId = 5,
			WhenFriendship = DateTime.Now
		},
		new UserFriendship
		{
			UserAId = 5,
			UserBId = 2,
			WhenFriendship = DateTime.Now
		},

		//Fer y Raquel
		new UserFriendship
		{
			UserAId = 6,
			UserBId = 3,
			WhenFriendship = DateTime.Now
		},
		new UserFriendship
		{
			UserAId = 3,
			UserBId = 6,
			WhenFriendship = DateTime.Now
		},

		//Mikel y Raquel
			new UserFriendship
		{
			UserAId = 2,
			UserBId = 6,
			WhenFriendship = null
		},
		new UserFriendship
		{
			UserAId = 6,
			UserBId = 2,
			WhenFriendship = null
		},

		//David y Raquel
		new UserFriendship
		{
			UserAId = 5,
			UserBId = 6,
			WhenFriendship = DateTime.Now
		},
		new UserFriendship
		{
			UserAId = 6,
			UserBId = 5,
			WhenFriendship = DateTime.Now
		},

		//Mikel y Jose
		new UserFriendship
		{
			UserAId = 2,
			UserBId = 4,
			WhenFriendship = DateTime.Now
		},
		new UserFriendship
		{
			UserAId = 4,
			UserBId = 2,
			WhenFriendship = DateTime.Now
		},

		//Fer y Jose
		new UserFriendship
		{
			UserAId = 3,
			UserBId = 4,
			WhenFriendship = null
		},
		new UserFriendship
		{
			UserAId = 4,
			UserBId = 3,
			WhenFriendship = null
		}
	];
```