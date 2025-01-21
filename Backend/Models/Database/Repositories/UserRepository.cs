using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories;

public class UserRepository : Repository<User>
{
  public UserRepository(DataContext dataContext) : base(dataContext)
  {

  }

  public async Task<User> GetByMailOrUsername(string identifier) {
    return await GetQueryable()
    .Where(user => user.Username == identifier || user.Mail == identifier)
    .FirstOrDefaultAsync();
  }
}
