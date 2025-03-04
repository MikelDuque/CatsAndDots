namespace Backend.Models.DTOs;

public class Request
{
	public long SenderId { get; set; }
	public long ReceiverId { get; set; }
	public RequestState State { get; set; }
}
