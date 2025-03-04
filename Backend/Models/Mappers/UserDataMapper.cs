using Backend.Models.Database.Entities;
using Backend.Models.DTOs.User;

namespace Backend.Models.Mappers
{
  public class UserDataMapper
  {
    public IEnumerable<UserData> ToDto(IEnumerable<User> users)
    {
      return users.Select(user => new UserData
      {
        Id = user.Id,
        Username = user.Username,
        Mail = user.Mail, 
        Avatar = user.Avatar,
        Role = user.Role,
        IsBanned = user.IsBanned
      });
    }

    public UserData ToDto(User user)
    {
      return new UserData
      {
        Id = user.Id,
        Username = user.Username,
        Mail = user.Mail,
        Avatar = user.Avatar,
        Role = user.Role,
        IsBanned = user.IsBanned
      };
    }
  }
}
