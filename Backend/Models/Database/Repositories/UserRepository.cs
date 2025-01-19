using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories;

public class UserRepository : Repository<User>
{
  public UserRepository(DataContext dataContext) : base(dataContext)
  {

  }

  public async Task<User> GetByLoginData(string identifier, string password) {
    return await GetQueryable()
    .Where(user => (user.Username == identifier || user.Mail == identifier) && user.Password == password )
    .FirstOrDefaultAsync();
  }
}
