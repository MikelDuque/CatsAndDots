namespace Backend.Models.DTOs;

public class UserFilter
{
  public int TotalPages { get; set; }
  public List<UserDto> FilteredUsers { get; set; }
}
