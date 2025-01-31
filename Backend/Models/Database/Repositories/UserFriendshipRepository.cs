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

	public async Task<List<User>> GetSentFriendshipList(long id)
	{
		return await GetQueryable()
		.Where(friendship => friendship.UserAId == id && friendship.WhenFriendship == null)
		.Select(friendship => friendship.UserB)
		.ToListAsync();
	}

	public async Task<List<User>> GetReceivedFriendshipList(long id)
	{
		return await GetQueryable()
		.Where(friendship => friendship.UserBId == id && friendship.WhenFriendship == null)
		.Select(friendship => friendship.UserA)
		.ToListAsync();
	}

	public void DeleteFriendship(long idA, long idB)
	{
		UserFriendship friendship = GetQueryable()
			.Where(friendship => friendship.UserAId == idA && friendship.UserBId == idB)
			.First();

		Delete(friendship);
	}
}
