using System.Text.Json;
using Backend.Models;
using Backend.Models.Database;
using Backend.Models.DTOs;
using Backend.Models.Mappers;

namespace Backend.WebSockets.Systems;

public class FriendshipSystem
{
	private readonly IServiceScopeFactory _scopeFactory;

	public FriendshipSystem(IServiceScopeFactory scopeFactory)
	{
		_scopeFactory = scopeFactory;
	}

	public async Task ChangeFriendship(WebSocketLink[] connections, WebSocketLink thisUser, FriendRequest friendRequest)
	{
		await ChangeFriendshipBD(friendRequest);
		await UpdateFriendState(connections, thisUser, friendRequest);
	}

	/* ----- MÉTODOS SCOPED (PRIVADOS)  ----- */

	private async Task ChangeFriendshipBD(FriendRequest friendRequest)
	{
		using IServiceScope serviceScope = _scopeFactory.CreateScope();
		UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
		FriendshipMapper friendshipMapper = serviceScope.ServiceProvider.GetService<FriendshipMapper>();

		switch (friendRequest.RequestState)
		{
			case FriendRequestState.Declined:
				unitOfWork.userFriendshipRepository.DeleteFriendship(friendRequest.SenderId, friendRequest.ReceiverId);
				break;
			case FriendRequestState.Pending:
				await unitOfWork.userFriendshipRepository.InsertAsync(friendshipMapper.ToPendingEntity(friendRequest));
				break;
			case FriendRequestState.Accepted:
				await unitOfWork.userFriendshipRepository.InsertAsync(friendshipMapper.ToAcceptedEntity(friendRequest));
				break;
		}
		await unitOfWork.SaveAsync();
	}

	private async Task UpdateFriendState(WebSocketLink[] connections, WebSocketLink thisUser, FriendRequest friendRequest)
	{
		List<Task> tasks = [];

		WebSocketLink friendUser = connections.FirstOrDefault(user => user.Id == friendRequest.ReceiverId);

		tasks.Add(thisUser.SendAsync(JsonSerializer.Serialize(friendUser)));
		tasks.Add(friendUser.SendAsync(JsonSerializer.Serialize(friendUser)));

		await Task.WhenAll(tasks);
	}
}
