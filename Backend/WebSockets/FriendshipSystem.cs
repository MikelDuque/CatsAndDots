using System.Text.Json;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.WebSockets;

public class FriendshipSystem
{
  private readonly IServiceScopeFactory _scopeFactory;

  public FriendshipSystem(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
  }

  public async Task GetFriendlist(WebSocketLink WSUser, WebSocketLink[] connections)
  {
		List<Task> tasks = new();

    IEnumerable<FriendDto> friendList = await GetFriendListScoped(WSUser);

		WebSocketLink[] userFriends = connections.Where(user => friendList.Any(friend => friend.Id == user.Id)).ToArray();

    foreach (WebSocketLink friend in userFriends)
    {
			IEnumerable<FriendDto> handlerFriendList = await GetFriendListScoped(friend);

			tasks.Add(WSUser.SendAsync(JsonSerializer.Serialize(handlerFriendList)));
    }

    await Task.WhenAll(tasks);
  }

  //SUBMETODOS SCOPED
  private async Task<IEnumerable<FriendDto>> GetFriendListScoped(WebSocketLink connection)
  {
    using (IServiceScope serviceScope = _scopeFactory.CreateScope())
    {
      FriendshipService friendService = serviceScope.ServiceProvider.GetRequiredService<FriendshipService>();

      return await friendService.GetFriendList(connection);
    }
  }

}
