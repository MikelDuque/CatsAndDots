using System.Text.Json;
using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using Backend.Services;

namespace Backend.WebSockets;

public class FriendshipSystem
{
  private readonly IServiceScopeFactory _scopeFactory;
  private readonly IServiceScope _serviceScope;
  private readonly UnitOfWork _unitOfWork;
  private readonly FriendMapper _friendMapper;

  public FriendshipSystem(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
    _serviceScope = _scopeFactory.CreateScope();
    _unitOfWork = _serviceScope.ServiceProvider.GetRequiredService<UnitOfWork>();
    _friendMapper = _serviceScope.ServiceProvider.GetRequiredService<FriendMapper>();
  }

  public async Task OnConnectFriendData(WebSocketLink connectedUser, WebSocketLink[] connections)
  {
		await SendFriendList(connectedUser);
    await UpdateUserData(connectedUser.Id, connections);
  }

  public async Task SendFriendList(WebSocketLink thisUser)
  {
    IEnumerable<UserDto> friendList = await GetFriendListDB(thisUser.Id);

    await thisUser.SendAsync(JsonSerializer.Serialize(friendList));
  }

  //MOVER FUNCIÓN AL SISTEMA DE USUARIO. SE LLAMA TRAS HABER HECHO EL SAVE DE LOS CAMBIOS DE INFO EN LA BDD
  public async Task UpdateUserData(long thisUserId, WebSocketLink[] connections)
  {
    List<Task> tasks = new();

    UserDto thisUser = await GetUserDto(thisUserId);
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

  //SUBMETODOS SCOPED
  private async Task<IEnumerable<UserDto>> GetFriendListDB(long userId)
  {
    using (IServiceScope serviceScope = _scopeFactory.CreateScope())
    {
      List<User> friendList = await _unitOfWork.UserRepository.GetFriendList(userId);

		  return _friendMapper.ToDto(friendList);
    }
  }

  private async Task<UserDto> GetUserDto(long userId)
  {
    using (IServiceScope serviceScope = _scopeFactory.CreateScope())
    {
      User user = await _unitOfWork.UserRepository.GetByIdAsync(userId);

		  return _friendMapper.ToDto(user);
    }
  }

}
