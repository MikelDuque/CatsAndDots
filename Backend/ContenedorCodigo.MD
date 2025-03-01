# Cats And Dots
## Contenedor de código reutilizable (Backend)

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

### Websocket FriendshipSystem
```
public class FriendshipSystem
{
	private readonly IServiceScopeFactory _scopeFactory;
	private readonly HashSet<WebSocketLink> _connections;

	public FriendshipSystem(IServiceScopeFactory scopeFactory, HashSet<WebSocketLink> connections)
	{
		_scopeFactory = scopeFactory;
		_connections = connections;
	}

	public async Task ChangeFriendship(Request friendRequest)
	{
		await ChangeFriendshipBD(friendRequest);
		await UpdateFriendState(friendRequest);
	}

	private async Task UpdateFriendState(Request friendRequest)
	{
		List<Task> tasks = [];
		WebSocketLink[] connections = _connections.ToArray();

		WebSocketLink senderUser = connections.FirstOrDefault(user => user.Id == friendRequest.SenderId);
		WebSocketLink receiverUser = connections.FirstOrDefault(user => user.Id == friendRequest.ReceiverId);

		FriendRequestMessage friendRequestMessage = new(friendRequest);

		switch (friendRequest.State)
		{
			case RequestState.Pending:
				tasks.Add(receiverUser.SendAsync(ParseHelper.Message(friendRequestMessage)));
				break;
			case RequestState.Accepted:
				UserDataMessage senderUserMessage = new(await UserHelper.GetUserDto(_scopeFactory, senderUser.Id));
				UserDataMessage receiverUserMessage = new(await UserHelper.GetUserDto(_scopeFactory, receiverUser.Id));
				
				tasks.Add(receiverUser.SendAsync(ParseHelper.Message(senderUserMessage)));
				tasks.Add(senderUser.SendAsync(ParseHelper.Message(receiverUserMessage)));
				goto case RequestState.Declined;
			case RequestState.Declined:
				tasks.Add(senderUser.SendAsync(ParseHelper.Message(friendRequestMessage)));
				break;
		};		

		await Task.WhenAll(tasks);
	}

	/* ----- MÉTODOS SCOPED (PRIVADOS)  ----- */

	private async Task ChangeFriendshipBD(Request friendRequest)
	{
		using IServiceScope serviceScope = _scopeFactory.CreateScope();
		UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
		FriendshipMapper friendshipMapper = serviceScope.ServiceProvider.GetService<FriendshipMapper>();

		switch (friendRequest.State)
		{
			case RequestState.Pending:
				await unitOfWork.userFriendshipRepository.InsertAsync(friendshipMapper.ToPendingEntity(friendRequest));
				break;
			case RequestState.Accepted:
				await unitOfWork.userFriendshipRepository.InsertAsync(friendshipMapper.ToAcceptedEntity(friendRequest));
				break;
			case RequestState.Declined:
				unitOfWork.userFriendshipRepository.DeleteFriendship(friendRequest.SenderId, friendRequest.ReceiverId);
				break;
		}

		await unitOfWork.SaveAsync();
	}
}
```

### MatchmakingSystem de Fernando
```
public class LobbySystem
{
  private readonly WebSocketNetwork _webSocketNetwork;
  private readonly ConcurrentQueue<WebSocketLink> _searchingPlayers = new();
  private readonly SemaphoreSlim _searchingPlayersSemaphore = new SemaphoreSlim(1, 1);
  private readonly ConcurrentDictionary<long, long> _pendingInvitations = new();

  public LobbySystem(WebSocketNetwork webSocketNetwork)
  {
    _webSocketNetwork = webSocketNetwork;
  }

  public async Task HandleMatchmakingAsync(WebSocketLink connectedUser, string message)
  {
    
    MatchmakingMessage matchmakingMessage = JsonSerializer.Deserialize<MatchmakingMessage>(message);

    switch (matchmakingMessage.Body.Action)
    {
      case MatchmakingRequestAction.Random:
        await SearchMatchAsync(connectedUser);
        break;
      case MatchmakingRequestAction.CancelRandom:
        await CancelSearchAsync(connectedUser);
        break;
      case MatchmakingRequestAction.InviteFriend:
        long friendId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.GuestId);
        await InviteFriendAsync(connectedUser, friendId);
        break;
      case MatchmakingRequestAction.AcceptInvitation:
        long hostId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.HostId);
        await AcceptInvitationAsync(connectedUser, hostId);
        break;
      case MatchmakingRequestAction.RejectInvitation:
        long Id = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.HostId);
        await RejectInvitationAsync(connectedUser, Id);
        break;
      default:
        await connectedUser.SendAsync(ParseHelper.GenericMessage("MatchmakingResponse", "Acción no reconocida."));
        break;
    }
  }

  public async Task SearchMatchAsync(WebSocketLink player)
  {
    await _searchingPlayersSemaphore.WaitAsync();
    try
    {
      _searchingPlayers.Enqueue(player);
      await TryMatchAsync();
    }
    finally
    {
      _searchingPlayersSemaphore.Release();
    }
    
  }

  private async Task TryMatchAsync()
  {
    if (_searchingPlayers.Count >= 2)
    {
      if (_searchingPlayers.TryDequeue(out WebSocketLink player1) &&
          _searchingPlayers.TryDequeue(out WebSocketLink player2))
      {
        await player1.SendAsync(ParseHelper.GenericMessage("MatchFound", new
        {
          Body = "Partida encontrada.",
          Role = "Host",
          OpponentId = player2.Id
        }));

        await player2.SendAsync(ParseHelper.GenericMessage("MatchFound", new
        {
          Body = "Partida encontrada.",
          Role = "Guest",
          OpponentId = player1.Id
        }));

        await _webSocketNetwork.StartMatchAsync(player1.Id, player2.Id);
      }
    }
  }

  
  public async Task CancelSearchAsync(WebSocketLink player)
  {
    await player.SendAsync(ParseHelper.GenericMessage("SearchCancelled", "Búsqueda cancelada."));


    var tempQueue = new ConcurrentQueue<WebSocketLink>();
    foreach (var p in _searchingPlayers)
    {
      if (p.Id != player.Id)
      {
        tempQueue.Enqueue(p);
      }
    }

    _searchingPlayers.Clear(); 

    while (!tempQueue.IsEmpty)
    {
      tempQueue.TryDequeue(out var p);
      _searchingPlayers.Enqueue(p); 
    }
  }

  public async Task InviteFriendAsync(WebSocketLink host, long friendId)
  {
    _pendingInvitations[host.Id] = friendId;

    WebSocketLink? friendSocket = _webSocketNetwork.GetConnectedUser(friendId);

    if (friendSocket != null)
    {
      var invitationMessage = new
      {
        type = "GameInvitation",
        senderId = host.Id
      };

      await friendSocket.SendAsync(ParseHelper.GenericMessage("GameInvitation", invitationMessage));
    }

  }

  public async Task AcceptInvitationAsync(WebSocketLink guest, long hostId)
  {
    if (_pendingInvitations.TryGetValue(hostId, out long storedGuestId) && storedGuestId == guest.Id)
    {
      _pendingInvitations.TryRemove(hostId, out _);
      WebSocketLink? hostSocket = _webSocketNetwork.GetConnectedUser(hostId);

      if (hostSocket != null)
      {
        await hostSocket.SendAsync(ParseHelper.GenericMessage("MatchStarted", new
        {
          Body = "El invitado ha aceptado la partida.",
          Role = "Host",
          OpponentId = guest.Id
        }));
      }

      await guest.SendAsync(ParseHelper.GenericMessage("MatchStarted", new
      {
        Body = "Partida iniciada.",
        Role = "Guest",
        OpponentId = hostId
      }));

      await _webSocketNetwork.StartMatchAsync(hostId, guest.Id);
    }
  }

  public async Task RejectInvitationAsync(WebSocketLink guest, long hostId)
  {
    if (_pendingInvitations.TryGetValue(hostId, out long storedGuestId) && storedGuestId == guest.Id)
    {
      _pendingInvitations.TryRemove(hostId, out _);
      WebSocketLink? hostSocket = _webSocketNetwork.GetConnectedUser(hostId);

      if (hostSocket != null)
      {
        await hostSocket.SendAsync(ParseHelper.GenericMessage("InvitationRejected", "El invitado ha rechazado la partida."));
      }

      await guest.SendAsync(ParseHelper.GenericMessage("InvitationRejected", "Has rechazado la invitación."));
    }
  }
}
```