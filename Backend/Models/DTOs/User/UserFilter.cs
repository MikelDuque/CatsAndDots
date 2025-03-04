namespace Backend.Models.DTOs.User;

public class UserFilter
{
	public int TotalPages { get; set; }
	public List<UserDto> FilteredUsers { get; set; }
}
