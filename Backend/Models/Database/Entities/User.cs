using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Entities;

[Index(nameof(Mail), IsUnique = true), Index(nameof(Username), IsUnique = true)]
public class User
{
  public long Id {get; set;}
  public required string Username {get; set;}
  public required string Mail {get; set;}
  public required string Password {get; set;}
  public required string Avatar {get; set;}
  public string Role {get; set;}

  /* RELACIONES N:M */
  public ICollection<User> Friends { get; } = [];
}
