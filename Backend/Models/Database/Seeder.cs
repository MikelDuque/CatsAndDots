using Backend.Helpers;
using Backend.Models.Database.Entities;

namespace Backend.Models.Database;

public class Seeder
{
  private readonly DataContext _dataContext;

  public Seeder(DataContext dataContext)
  {
    _dataContext = dataContext;
  }

  public void SeedAll()
  {
    Seed();
    _dataContext.SaveChanges();
  }

  private void Seed()
  {
    /* --- USERS --- */
    User[] users =
    [
      new User
      {
        Username = "catministrator",
        Mail = "admin@catsanddots.es",
        Password = HashHelper.Hash("12345"),
        Avatar = "",
        Role = "admin",
        State = UserState.Offline
      }
    ];

    /* --- INSERCCIÓN ENTIDADES --- */
    _dataContext.Users.AddRange(users);
  }
}
