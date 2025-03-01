using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;

namespace Backend.Services;

public class UserService
{
  private readonly UnitOfWork _unitOfWork;
	private readonly UserMapper _userMapper;

	public UserService(UnitOfWork unitOfWork, UserMapper friendMapper)
	{
		_unitOfWork = unitOfWork;
		_userMapper = friendMapper;
	}

	public async Task<IEnumerable<UserDto>> GetFriendList(long userId)
	{
		List<User> friendList = await _unitOfWork.userFriendshipRepository.GetFriendList(userId);

		return _userMapper.ToDto(friendList);
	}

	public async Task<PendingFriendList> GetPendingFriends(long userId)
	{
		List<User> receivedFriendRequests = await _unitOfWork.userFriendshipRepository.GetReceivedFriendshipList(userId);
		List<User> sentFriendRequests = await _unitOfWork.userFriendshipRepository.GetSentFriendshipList(userId);

		return new PendingFriendList {
			receivedFriendRequests = _userMapper.ToDto(receivedFriendRequests),
			sentFriendRequests = _userMapper.ToDto(sentFriendRequests)
		};
	}

	public async Task<IEnumerable<UserDto>> GetFilteredUsers(string search) {

    IEnumerable<User> filteredUsers = await _unitOfWork.UserRepository.GetFilteredUsers(search);

    return _userMapper.ToDto(filteredUsers);
	}
}
