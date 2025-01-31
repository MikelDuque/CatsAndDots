using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class FriendRequestMessage : IMessage<FriendRequest>
{
  public string MessageType { get; set; }
  public FriendRequest Body { get; set; }

  public FriendRequestMessage(string messageType, FriendRequest body)
  {
    this.MessageType = messageType;
    this.Body = body;
  }
}
