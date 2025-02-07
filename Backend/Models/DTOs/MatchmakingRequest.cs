namespace Backend.Models.DTOs;

public class MatchmakingRequest
{
  public string Action { get; set; }
  public long HostId { get; set; }
  public long GuestId { get; set; }
}
