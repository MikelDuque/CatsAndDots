namespace Backend.Models.DTOs.User;

public class UserDto
{
	public long Id { get; set; }
	public string Username { get; set; }
	public string Avatar { get; set; }
	public string Role { get; set; }
	public ConnectionState ConnectionState { get; set; }
}
