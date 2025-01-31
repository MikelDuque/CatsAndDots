using Backend.Models.Database.Entities;
using Backend.Models.DTOs;

namespace Backend.Models.Mappers;

public class FriendshipMapper
{
	public UserFriendship ToPendingEntity(FriendRequest request)
	{
		return new UserFriendship
		{
			UserAId = request.SenderId,
			UserBId = request.ReceiverId,
			WhenFriendship = null
		};
	}
	public UserFriendship ToAcceptedEntity(FriendRequest request)
	{
		return new UserFriendship
		{
			UserAId = request.ReceiverId,
			UserBId = request.SenderId,
			WhenFriendship = DateTime.UtcNow
		};
	}

	public IEnumerable<UserFriendship> ToPendingEntity(IEnumerable<FriendRequest> friendRequests)
	{
		return friendRequests.Select(ToPendingEntity);
	}

	public IEnumerable<UserFriendship> ToAcceptedEntity(IEnumerable<FriendRequest> friendRequests)
	{
		return friendRequests.Select(ToAcceptedEntity);
	}
}
