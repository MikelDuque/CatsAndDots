using System;

namespace Backend.Models.DTOs;

public class GameLobby
{
  public bool ShouldStart { get; set; }
  public long HostId { get; set; }
  public long GuestId { get; set; }
}
