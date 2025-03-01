using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;

namespace Backend.Services;

public class UserService
{
  private readonly UnitOfWork _unitOfWork;
	private readonly UserMapper _userMapper;
	private readonly FriendshipMapper _friendshipMapper;

	public UserService(UnitOfWork unitOfWork, UserMapper friendMapper, FriendshipMapper friendshipMapper)
	{
		_unitOfWork = unitOfWork;
		_userMapper = friendMapper;
		_friendshipMapper = friendshipMapper;
	}

	public async Task<IEnumerable<UserDto>> GetFriendList(long userId)
	{
		List<User> friendList = await _unitOfWork.userFriendshipRepository.GetFriendList(userId);

		return _userMapper.ToDto(friendList);
	}

	public async Task<PendingFriends> GetPendingFriends(long userId)
	{
		IEnumerable<User> pendingReceivedFriendList = await _unitOfWork.userFriendshipRepository.GetReceivedFriendshipList(userId);
		IEnumerable<User> pendingSentFriendList = await _unitOfWork.userFriendshipRepository.GetSentFriendshipList(userId);

		IEnumerable<UserFriendship> receivedFriendRequests = await _unitOfWork.userFriendshipRepository.GetReceivedFriendshipRequests(userId);

		return new PendingFriends()
    {
			sentFriendList = _userMapper.ToDto(pendingSentFriendList),
			receivedFriendList = _userMapper.ToDto(pendingReceivedFriendList),
			receivedFriendRequests = _friendshipMapper.ToDto(receivedFriendRequests)
		};
	}

	public async Task<IEnumerable<UserDto>> GetFilteredUsers(string search) {

    IEnumerable<User> filteredUsers = await _unitOfWork.UserRepository.GetFilteredUsers(search);

    return _userMapper.ToDto(filteredUsers);
	}
}
