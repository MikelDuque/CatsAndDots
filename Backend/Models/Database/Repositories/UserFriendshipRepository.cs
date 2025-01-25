using Backend.Models.Database.Entities;

namespace Backend.Models.Database.Repositories
{
    public class UserFriendshipRepository : Repository<UserFriendship>
    {
        public UserFriendshipRepository(DataContext dataContext) : base(dataContext) { }
    }
}
