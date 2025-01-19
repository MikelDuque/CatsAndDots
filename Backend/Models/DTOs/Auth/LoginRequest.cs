namespace Backend.Models.DTOs;

public class LoginRequest
{
  public string UserName {get; set;}
  public string Identifier {get;set;}
  public required string Password {get;set;}
}
