using Backend.Models.Database.Entities;
using Backend.Models.DTOs;

namespace Backend.Models.Mappers;

public class FriendMapper
{
  //TO DTO
  public FriendDto ToDto(User friend, bool isOpen)
  {
    return new FriendDto
    {
      Id = friend.Id,
      Username = friend.Username,
      Avatar = friend.Avatar,
      ConnectionState = isOpen ? ConnectionState.Online : ConnectionState.Offline
    };
  }

  public IEnumerable<FriendDto> ToDto(IEnumerable<User> friends, bool isOpen) 
  {
    return friends.Select(friend => ToDto(friend, isOpen));
  }
}
