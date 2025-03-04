using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class GameMessage : IMessage<GameLobby>
{
  public string MessageType => "Game";
  public GameLobby Body { get; set; }

  public GameMessage(GameLobby body)
  {
    Body = body;
  }
}
