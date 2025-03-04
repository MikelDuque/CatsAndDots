namespace Backend.Models.DTOs.User;

public class UserData
{
	public long Id { get; set; }
	public string Username { get; set; }
	public string Mail { get; set; }
	public string Avatar { get; set; }
	public string Role { get; set; }
	public bool IsBanned { get; set; }
}
