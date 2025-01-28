namespace Backend.Models.DTOs;

public class FriendRequest
{
	public long SenderId { get; set; }
	public long ReceiverId { get; set; }
	public FriendRequestState RequestState { get; set; }
}
