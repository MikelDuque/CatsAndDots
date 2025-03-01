namespace Backend.Models.DTOs;

public class PendingFriends
{
  public IEnumerable<UserDto> receivedFriendList {get; set;}
  public IEnumerable<UserDto> sentFriendList {get; set;}
  public IEnumerable<Request> receivedFriendRequests {get; set;}
}
