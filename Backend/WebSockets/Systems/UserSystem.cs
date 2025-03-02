using Backend.Models;
using Backend.Models.Database.Entities;
using Backend.Models.Database;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using Backend.WebSockets.Messages;
using Backend.Services;
using Backend.Helpers;

namespace Backend.WebSockets.Systems;

public class UserSystem
{
	private readonly IServiceScopeFactory _scopeFactory;
	private readonly HashSet<WebSocketLink> _connections;
  private readonly int _currentMatches;

  public UserSystem(IServiceScopeFactory scopeFactory, HashSet<WebSocketLink> connections, int currentMatches)
	{
		_scopeFactory = scopeFactory;
		_connections = connections;
    _currentMatches = currentMatches;
  }

	public async Task ConnectionChangeAsync(WebSocketLink connectedUser, ConnectionState state)
	{
		await GetMenuData();
		await UpdateUserData(connectedUser.Id, state);
	}

	public async Task UpdateUserData(long thisUserId, ConnectionState connectionState)
	{
		List<Task> tasks = [];
		WebSocketLink[] connections = _connections.ToArray();

		UserDto thisUser = await UserHelper.GetUserDto(_scopeFactory, thisUserId);
		UserDataMessage userDataMessage = new(thisUser);	//Esto se puede cambiar al usar en el "ParseHelper" el "GenericMessage"

		IEnumerable<UserDto> friendList = await GetFriendListDB(thisUserId);
		foreach (WebSocketLink connectedUser in connections)
		{
			if (friendList.Any(friend => friend.Id == connectedUser.Id))
			{
				tasks.Add(connectedUser.SendAsync(ParseHelper.Message(userDataMessage)));
			}
		}

		await Task.WhenAll(tasks);
	}


	/* ----- MÉTODOS PRIVADOS ----- */
	private Task GetMenuData()
	{
		List<Task> tasks = [];
		WebSocketLink[] connections = _connections.ToArray();

		MenuData menuData = new()
		{
			OnlineUsers = connections.Length,
			PlayingUsers = connections.Where(user => user.ConnectionState == ConnectionState.Playing).Count(),
			CurrentMatches = _currentMatches
    };
		MenuDataMessage menuDataMessage = new(menuData);	//Esto se puede cambiar al usar en el "ParseHelper" el "GenericMessage"

		foreach (WebSocketLink user in connections)
		{
			tasks.Add(user.SendAsync(ParseHelper.Message(menuDataMessage)));
		}

		return Task.WhenAll(tasks);
	}

	/*
	private async Task SendFriendList(WebSocketLink thisUser)
	{
		IEnumerable<UserDto> friendList = await GetFriendListDB(thisUser.Id);

		await thisUser.SendAsync(JsonSerializer.Serialize(new FriendListMessage(friendList)));
	}
	*/
	

	/* ----- METODOS SCOPED ----- */
	
	private async Task<IEnumerable<UserDto>> GetFriendListDB(long userId)
	{
		using IServiceScope serviceScope = _scopeFactory.CreateScope();
		UserService friendshipService = serviceScope.ServiceProvider.GetService<UserService>();

		return await friendshipService.GetFriendList(userId);
	}
}
