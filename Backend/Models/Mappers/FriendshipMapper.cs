using Backend.Models.Database.Entities;
using Backend.Models.DTOs;

namespace Backend.Models.Mappers;

public class FriendshipMapper
{
	//To Entity
	public UserFriendship ToPendingEntity(Request request)
	{
		return new UserFriendship
		{
			UserAId = request.SenderId,
			UserBId = request.ReceiverId,
			WhenFriendship = null
		};
	}
	public UserFriendship ToAcceptedEntity(Request request)
	{
		return new UserFriendship
		{
			UserAId = request.ReceiverId,
			UserBId = request.SenderId,
			WhenFriendship = DateTime.UtcNow
		};
	}

	public IEnumerable<UserFriendship> ToPendingEntity(IEnumerable<Request> friendRequests)
	{
		return friendRequests.Select(ToPendingEntity);
	}

	public IEnumerable<UserFriendship> ToAcceptedEntity(IEnumerable<Request> friendRequests)
	{
		return friendRequests.Select(ToAcceptedEntity);
	}

	//To Dto
	public Request ToDto(UserFriendship request)
	{
		return new Request
		{
			SenderId = request.UserAId,
			ReceiverId = request.UserBId,
			State = request.WhenFriendship == null ? RequestState.Pending : RequestState.Accepted
		};
	}

	public IEnumerable<Request> ToDto(IEnumerable<UserFriendship> friendRequests)
	{
		return friendRequests.Select(ToDto);
	}
}
