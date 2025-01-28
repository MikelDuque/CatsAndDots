using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using Backend.WebSockets;

namespace Backend.Services;

public class FriendshipService
{
  private readonly UnitOfWork _unitOfWork;
	private readonly FriendMapper _friendMapper;

	public FriendshipService(UnitOfWork unitOfWork, FriendMapper friendMapper)
	{
		_unitOfWork = unitOfWork;
		_friendMapper = friendMapper;
	}

	public async Task<IEnumerable<FriendDto>> GetFriendList(WebSocketHandler handler)
	{
		List<User> friendList = await _unitOfWork.UserRepository.GetFriendList(handler.Id);

		return _friendMapper.ToDto(friendList, handler.IsOpen);
	}
}
