namespace Backend.Models.DTOs.User;

public class HandleUser
{
	public required long UserId { get; set; }
	public required string Role { get; set; }
	public bool IsBanned { get; set; }
}
