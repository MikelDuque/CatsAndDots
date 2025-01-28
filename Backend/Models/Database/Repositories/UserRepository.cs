using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories;

public class UserRepository : Repository<User>
{
  public UserRepository(DataContext dataContext) : base(dataContext) { }
  
  public async Task<List<User>> GetFriendList(long id)
  {
    return await GetQueryable()
      .Where(user => user.Id == id)
      .Include(user => user.FriendConnections)
      .Where(user => user.FriendConnections.Any(connection => connection.IsFriendship))
      .ToListAsync();
  }

  public async Task<User> GetByMailOrUsername(string identifier)
  {
    return await GetQueryable()
    .Where(user => identifier.Contains('@') ? user.Mail == identifier : user.Username == identifier)
    .Include(user => user.FriendConnections)
    .SingleOrDefaultAsync();
  }
}
