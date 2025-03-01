using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class FriendRequestMessage : IMessage<Request>
{
  public string MessageType => "Request";
  public Request Body { get; set; }

  public FriendRequestMessage(Request body)
  {
    Body = body;
  }
}
