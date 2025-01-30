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