namespace Backend.Models.DTOs;

public class LoginRequest
{
  public string Identifier {get;set;}
  public required string Password {get;set;}
}
