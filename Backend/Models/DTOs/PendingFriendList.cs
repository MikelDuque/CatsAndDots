namespace Backend.Models.DTOs;

public class PendingFriendList
{
  public IEnumerable<UserDto> receivedFriendRequests;
  public IEnumerable<UserDto> sentFriendRequests;
}
