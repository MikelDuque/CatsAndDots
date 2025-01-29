using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories;
public class UserFriendshipRepository : Repository<UserFriendship>
{
    public UserFriendshipRepository(DataContext dataContext) : base(dataContext) { }

    public async Task<List<User>> GetFriendList(long id)
    {

        return await GetQueryable()
        .Where(friendship => friendship.UserAId == id && friendship.WhenFriendship != null)
        .Select(friendship => friendship.UserB)
        .ToListAsync();
    }
}
