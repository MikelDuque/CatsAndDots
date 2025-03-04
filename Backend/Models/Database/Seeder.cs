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
				IsBanned = false
      },
      new User
      {
        Username = "Mikel",
        Mail = "mikel@catsanddots.es",
        Password = HashHelper.Hash("12345"),
        Avatar = "/ProfilePictures/Default-Avatar.png",
        Role = "admin",
				IsBanned = false
			},
      new User
      {
        Username = "fer",
        Mail = "fernando@catsanddots.es",
        Password = HashHelper.Hash("12345"),
        Avatar = "/ProfilePictures/Default-Avatar.png",
        Role = "admin",
				IsBanned = false
			},
			new User
			{
				Username = "Jose",
				Mail = "jose@gmail.es",
				Password = HashHelper.Hash("12345"),
				Avatar = "/ProfilePictures/Default-Avatar.png",
				Role = "admin",
				IsBanned = false
			},
			new User
			{
				Username = "Utsugi",
				Mail = "david@gmail.es",
				Password = HashHelper.Hash("12345"),
				Avatar = "/ProfilePictures/Default-Avatar.png",
				Role = null,
				IsBanned = false
			},
			new User
			{
				Username = "Ralowl",
				Mail = "raquel@gmail.es",
				Password = HashHelper.Hash("12345"),
				Avatar = "/ProfilePictures/Default-Avatar.png",
				Role = null,
				IsBanned = false
			}
		];

    /* --- FRIENDSHIPS --- */
    UserFriendship[] friendships =
    [
			//Mikel y Fer
      new UserFriendship
      {
        UserAId = 2,
        UserBId = 3,
        WhenFriendship = DateTime.Now
      },
			new UserFriendship
			{
				UserAId = 3,
				UserBId = 2,
				WhenFriendship = DateTime.Now
			},

			//Mikel y David
			new UserFriendship
			{
				UserAId = 2,
				UserBId = 5,
				WhenFriendship = DateTime.Now
			},
			new UserFriendship
			{
				UserAId = 5,
				UserBId = 2,
				WhenFriendship = DateTime.Now
			},

			//Fer y Raquel
			new UserFriendship
			{
				UserAId = 6,
				UserBId = 3,
				WhenFriendship = DateTime.Now
			},
			new UserFriendship
			{
				UserAId = 3,
				UserBId = 6,
				WhenFriendship = DateTime.Now
			},

			//Mikel a Raquel pendiente
			 new UserFriendship
			{
				UserAId = 2,
				UserBId = 6,
				WhenFriendship = null
			},

			//David y Raquel
			new UserFriendship
			{
				UserAId = 5,
				UserBId = 6,
				WhenFriendship = DateTime.Now
			},
			new UserFriendship
			{
				UserAId = 6,
				UserBId = 5,
				WhenFriendship = DateTime.Now
			},

			//Jose a Mikel pendiente
			new UserFriendship
			{
				UserAId = 4,
				UserBId = 2,
				WhenFriendship = null
			},

			//Fer y Jose
			new UserFriendship
			{
				UserAId = 3,
				UserBId = 4,
				WhenFriendship = null
			},
			new UserFriendship
			{
				UserAId = 4,
				UserBId = 3,
				WhenFriendship = null
			}
		];

    /* --- INSERCCIÓN ENTIDADES --- */
    _dataContext.Users.AddRange(users);
    _dataContext.SaveChanges();
    _dataContext.UserFriendships.AddRange(friendships);
  }
}
