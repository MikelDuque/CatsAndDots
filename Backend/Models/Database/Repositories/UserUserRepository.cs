using Backend.Models.Database.Entities;

namespace Backend.Models.Database.Repositories
{
    public class UserUserRepository : Repository<UserFriend>
    {
        public UserUserRepository(DataContext dataContext) : base(dataContext) { }
    }
}
