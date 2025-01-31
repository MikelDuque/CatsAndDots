using Backend.Models.Database.Entities;
using Backend.Models.DTOs;

namespace Backend.Models.Mappers;

public class UserMapper
{
  public UserDto ToDto(User user)
  {
    return new UserDto
    {
      Id = user.Id,
      Username = user.Username,
      Avatar = user.Avatar
    };
  }

  public IEnumerable<UserDto> ToDto(IEnumerable<User> friends) 
  {
    return friends.Select(ToDto);
  }
}
