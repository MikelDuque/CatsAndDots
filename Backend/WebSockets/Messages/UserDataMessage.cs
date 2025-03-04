using Backend.Models.DTOs.User;

namespace Backend.WebSockets.Messages;

public class UserDataMessage : IMessage<UserDto>
{
	public string MessageType => "UserData";
	public UserDto Body { get; set; }

	public UserDataMessage(UserDto body)
	{
		Body = body;
	}
}
