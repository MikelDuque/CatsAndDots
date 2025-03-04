using Backend.Models.Database.Entities;
using Backend.Models.DTOs.User;
using Backend.WebSockets;

namespace Backend.Models.Mappers;

public class UserMapper
{
  WebSocketNetwork _wsNetwork;

  public UserMapper(WebSocketNetwork wsNetwork)
  {
    _wsNetwork = wsNetwork;
  }

  public UserDto ToDto(User user)
  {
    WebSocketLink connectedUser = _wsNetwork.GetConnectedUser(user.Id);
    
    return new UserDto
    {
      Id = user.Id,
      Username = user.Username,
      Avatar = user.Avatar,
      Role = user.Role,
      ConnectionState = connectedUser != null ? connectedUser.ConnectionState : ConnectionState.Offline
    };
  }

  public IEnumerable<UserDto> ToDto(IEnumerable<User> friends) 
  {
    return friends.Select(ToDto);
  }
}
