using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class FriendRequestMessage : IMessage<FriendRequest>
{
  public string MessageType => "FriendRequest";
  public FriendRequest Body { get; set; }

  public FriendRequestMessage(FriendRequest body)
  {
    Body = body;
  }
}
