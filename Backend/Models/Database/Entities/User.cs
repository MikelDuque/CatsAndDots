namespace Backend.Models.Database.Entities;

public class User
{
    public long Id {get; set;}
    public required string Username {get; set;}
    public required string Mail {get; set;}
    public required string Password {get; set;}
    public required string Avatar {get; set;}
    public string Role {get; set;}
    public UserState State {get; set;}  //¿Lo haremos "required"?
}
