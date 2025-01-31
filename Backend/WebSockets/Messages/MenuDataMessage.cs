using Backend.Models.DTOs;

namespace Backend.WebSockets.Messages;

public class MenuDataMessage : IMessage<MenuData>
{
  public string MessageType => "MenuData";
  public MenuData Body { get; set; }

  public MenuDataMessage(MenuData body)
  {
    Body = body;
  }
}
