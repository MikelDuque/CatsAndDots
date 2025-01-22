namespace Backend.Models.DTOs.Auth;

public class RegisterRequest
{
  public required string Username {get; set;}
  public required string Mail {get; set;}
  public required string Password {get; set;}
  public IFormFile Avatar {get; set;}
}