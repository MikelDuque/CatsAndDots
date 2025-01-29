using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;
using Backend.WebSockets;

namespace Backend.Services;

public class FriendshipService
{
  private readonly UnitOfWork _unitOfWork;
	private readonly UserMapper _userMapper;

	public FriendshipService(UnitOfWork unitOfWork, UserMapper friendMapper)
	{
		_unitOfWork = unitOfWork;
		_userMapper = friendMapper;
	}

	public async Task<IEnumerable<UserDto>> GetFriendList(WebSocketLink connection)
	{
		List<User> friendList = await _unitOfWork.userFriendshipRepository.GetFriendList(connection.Id);

		return _userMapper.ToDto(friendList);
	}
}
