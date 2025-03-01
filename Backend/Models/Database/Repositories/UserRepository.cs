using Backend.Helpers;
using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Models.Database.Repositories;

public class UserRepository : Repository<User>
{
  public UserRepository(DataContext dataContext) : base(dataContext) { }

  public async Task<User> GetByMailOrUsername(string identifier)
  {
    return await GetQueryable()
    .Where(user => identifier.Contains('@') ? user.Mail == identifier.ToLowerInvariant() : user.Username == identifier)
    .SingleOrDefaultAsync();
  }

  public async Task<IEnumerable<User>> GetFilteredUsers(string search)
  {
    TextComparer _textComparer = new();

    return _textComparer.SearchFilter(await GetAllAsync(), search);
  }
}
