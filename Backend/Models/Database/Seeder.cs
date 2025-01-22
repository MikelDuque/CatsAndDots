using System.Data;
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
        Password = "1234", //AQUI HAY QUE HASHEAR
        Avatar = "",
        Role = "admin",
        State = UserState.Offline
      }
    ];

    /* --- INSERCCIÓN ENTIDADES --- */
    _dataContext.Users.AddRange(users);
  }
}
