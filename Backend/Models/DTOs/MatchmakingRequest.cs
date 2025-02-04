namespace Backend.Models.DTOs;

public class MatchmakingRequest
{
  public string Action { get; set; } // Aquí está la propiedad Action
  public object? Data { get; set; }

  public MatchmakingRequest(string action, object? data = null)
  {
    Action = action;
    Data = data;
  }
}
