using Backend.Helpers;
using Backend.Models;
using Backend.Models.Database;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using Backend.WebSockets.Messages;

namespace Backend.WebSockets.Systems;

public class RequestSystem
{
  private readonly IServiceScopeFactory _scopeFactory;
	private readonly HashSet<WebSocketLink> _connections;

	public RequestSystem(IServiceScopeFactory scopeFactory, HashSet<WebSocketLink> connections)
	{
		_scopeFactory = scopeFactory;
		_connections = connections;
	}

	public async Task HandleFriendship(Request friendRequest)
	{
    FriendRequestMessage friendRequestMessage = new(friendRequest);

		await ChangeFriendshipBD(friendRequest);
		await UpdateState(friendRequest, friendRequestMessage);
	}

  public async Task HandleMatchmaking(Request matchmakingRequest)
	{
    MatchmakingMessage matchmakingMessage = new(matchmakingRequest);

		await UpdateState(matchmakingRequest, matchmakingMessage);
	}

	private async Task UpdateState(Request request, IMessage<Request> message)
	{
		List<Task> tasks = [];
		WebSocketLink[] connections = _connections.ToArray();

		WebSocketLink senderUser = connections.FirstOrDefault(user => user.Id == request.SenderId);
		WebSocketLink receiverUser = connections.FirstOrDefault(user => user.Id == request.ReceiverId);

		switch (request.State)
		{
			case RequestState.Pending:
				tasks.Add(receiverUser.SendAsync(ParseHelper.Message(message)));
				break;

			case RequestState.Accepted:
				UserDataMessage senderUserMessage = new(await UserHelper.GetUserDto(_scopeFactory, senderUser.Id));
				UserDataMessage receiverUserMessage = new(await UserHelper.GetUserDto(_scopeFactory, receiverUser.Id));
				
				tasks.Add(receiverUser.SendAsync(ParseHelper.Message(senderUserMessage)));
				tasks.Add(senderUser.SendAsync(ParseHelper.Message(receiverUserMessage)));
				goto case RequestState.Rejected;

			case RequestState.Rejected:
				tasks.Add(senderUser.SendAsync(ParseHelper.Message(message)));
				break;
		};

		await Task.WhenAll(tasks);
	}

	/* ----- MÉTODOS SCOPED (PRIVADOS)  ----- */

	private async Task ChangeFriendshipBD(Request request)
	{
		using IServiceScope serviceScope = _scopeFactory.CreateScope();
		UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
		FriendshipMapper friendshipMapper = serviceScope.ServiceProvider.GetService<FriendshipMapper>();

		switch (request.State)
		{
			case RequestState.Pending:
				await unitOfWork.userFriendshipRepository.InsertAsync(friendshipMapper.ToPendingEntity(request));
				break;

			case RequestState.Accepted:
				await unitOfWork.userFriendshipRepository.InsertAsync(friendshipMapper.ToAcceptedEntity(request));
				break;
				
			case RequestState.Rejected:
				unitOfWork.userFriendshipRepository.DeleteFriendship(request.SenderId, request.ReceiverId);
				break;
		}

		await unitOfWork.SaveAsync();
	}
}