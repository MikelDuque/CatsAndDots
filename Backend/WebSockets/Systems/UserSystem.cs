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
  private readonly WebSocketNetwork _webSocketNetwork;

  public UserSystem(IServiceScopeFactory scopeFactory, HashSet<WebSocketLink> connections, WebSocketNetwork webSocketNetwork)
	{
		_scopeFactory = scopeFactory;
		_connections = connections;
    _webSocketNetwork = webSocketNetwork;

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

		UserDto thisUser = await GetUserDto(thisUserId);
		UserDataMessage userDataMessage = new UserDataMessage(thisUser);	//Esto se puede cambiar al usar en el "ParseHelper" el "GenericMessage"

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
			PlayingUsers = 0, //CAMBIAR
			CurrentMatches = _webSocketNetwork.ActiveMatchesCount
    };
		MenuDataMessage menuDataMessage = new MenuDataMessage(menuData);	//Esto se puede cambiar al usar en el "ParseHelper" el "GenericMessage"

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

	private async Task<UserDto> GetUserDto(long userId)
	{
		using IServiceScope serviceScope = _scopeFactory.CreateScope();
		UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
		UserMapper userMapper = serviceScope.ServiceProvider.GetService<UserMapper>();

		User user = await unitOfWork.UserRepository.GetByIdAsync(userId);

		return userMapper.ToDto(user);
	}
}
