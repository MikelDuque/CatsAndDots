using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class MatchmakingMessage : IMessage<MatchmakingRequest>
{
  public string MessageType => "Matchmaking";
  public MatchmakingRequest Body { get; set; }

  public MatchmakingMessage(MatchmakingRequest body)
  {
    Body = body;
  }
}
