using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class MatchmakingMessage : IMessage<Request>
{
  public string MessageType => "MatchmakingRequest";
  public Request Body { get; set; }

  public MatchmakingMessage(Request body)
  {
    Body = body;
  }
}
