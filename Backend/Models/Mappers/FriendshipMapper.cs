using Backend.Models.Database.Entities;
using Backend.Models.DTOs;

namespace Backend.Models.Mappers;

public class FriendshipMapper
{
	public UserFriendship ToEntity(FriendRequest request)
	{
		FriendRequestState state = request.RequestState;

		return new UserFriendship
		{
			UserAId = request.SenderId,
			UserBId = request.ReceiverId,
			WhenFriendship = state == FriendRequestState.Accepted ? DateTime.UtcNow : null
		};
	}

	public IEnumerable<UserFriendship> ToEntity(IEnumerable<FriendRequest> friendRequests)
	{
		return friendRequests.Select(ToEntity);
	}
}
