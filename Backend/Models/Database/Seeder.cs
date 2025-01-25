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
        Avatar = "/ProfilePictures/Default-Avatar.png",
        Role = "admin",
        State = UserState.Offline
      },
      new User
      {
        Username = "mikel",
        Mail = "mikel@catsanddots.es",
        Password = HashHelper.Hash("12345"),
        Avatar = "/ProfilePictures/Default-Avatar.png",
        Role = "admin",
        State = UserState.Offline
      },
      new User
      {
        Username = "fer",
        Mail = "fernando@catsanddots.es",
        Password = HashHelper.Hash("12345"),
        Avatar = "/ProfilePictures/Default-Avatar.png",
        Role = "admin",
        State = UserState.Offline
      }
    ];

    /* --- FRIENDSHIPS --- */
    UserFriend[] friendships =
    [
      new UserFriend
      {
        UserAId = 2,
        UserBId = 3,
        IsFriendship = true
      }
    ];

    /* --- INSERCCIÓN ENTIDADES --- */
    _dataContext.Users.AddRange(users);
    _dataContext.SaveChanges();
    _dataContext.UserFriendships.AddRange(friendships);
  }
}
