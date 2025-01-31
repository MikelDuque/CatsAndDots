using Backend.Models;
using Backend.Models.Database.Entities;
using Backend.Models.Database;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using System.Text.Json;
using Backend.WebSockets.Messages;

namespace Backend.WebSockets.Systems;

public class UserSystem
{
	private readonly IServiceScopeFactory _scopeFactory;

	public UserSystem(IServiceScopeFactory scopeFactory)
	{
		_scopeFactory = scopeFactory;
	}

	public async Task OnConnectedAsync(WebSocketLink connectedUser, WebSocketLink[] connections)
	{
		await GetMenuData(connections);
		await SendFriendList(connectedUser);
		await UpdateUserData(connectedUser.Id, connections, ConnectionState.Online);
	}

	public async Task OnDisconnectedAsync(WebSocketLink connectedUser, WebSocketLink[] connections)
	{
		await UpdateUserData(connectedUser.Id, connections, ConnectionState.Offline);
	}

	public async Task UpdateUserData(long thisUserId, WebSocketLink[] connections, ConnectionState connectionState)
	{
		List<Task> tasks = [];

		UserDto thisUser = await GetUserDto(thisUserId);
		thisUser.ConnectionState = connectionState;

		IEnumerable<UserDto> friendList = await GetFriendListDB(thisUserId);

		foreach (WebSocketLink connectedUser in connections)
		{
			if (friendList.Any(friend => friend.Id == connectedUser.Id))
			{
				tasks.Add(connectedUser.SendAsync(JsonSerializer.Serialize(thisUser)));
			}
		}

		await Task.WhenAll(tasks);
	}


	/* ----- MÉTODOS PRIVADOS ----- */
	private Task GetMenuData(WebSocketLink[] connections)
	{
		List<Task> tasks = [];

		MenuData menuData = new()
		{
			OnlineUsers = connections.Length,
			PlayingUsers = 0, //CAMBIAR
			CurrentMatches = 0 //CAMBIAR
		};

		foreach (WebSocketLink user in connections)
		{
			tasks.Add(user.SendAsync(JsonSerializer.Serialize(new MenuDataMessage(menuData))));
		}

		return Task.WhenAll(tasks);
	}

	private async Task SendFriendList(WebSocketLink thisUser)
	{
		IEnumerable<UserDto> friendList = await GetFriendListDB(thisUser.Id);

		await thisUser.SendAsync(JsonSerializer.Serialize(new FriendListMessage(friendList)));
	}
	

	/* ----- METODOS SCOPED ----- */
	private async Task<IEnumerable<UserDto>> GetFriendListDB(long userId)
	{
		using IServiceScope serviceScope = _scopeFactory.CreateScope();
		UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
		UserMapper userMapper = serviceScope.ServiceProvider.GetService<UserMapper>();

		List<User> friendList = await unitOfWork.userFriendshipRepository.GetFriendList(userId);

		return userMapper.ToDto(friendList);
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
