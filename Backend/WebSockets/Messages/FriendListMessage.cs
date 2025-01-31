using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class FriendListMessage : IMessage<IEnumerable<UserDto>>
{
  public string MessageType => "FriendList";
  public IEnumerable<UserDto> Body { get; set; }

  public FriendListMessage(IEnumerable<UserDto> body)
  {
    Body = body;
  }
}
