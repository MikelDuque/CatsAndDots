using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.DTOs.User;
using Backend.Models.Mappers;

namespace Backend.Services;

public class UserService
{
  private readonly UnitOfWork _unitOfWork;
	private readonly UserMapper _userMapper;
	private readonly UserDataMapper _userDataMapper;
	private readonly FriendshipMapper _friendshipMapper;

	public UserService(UnitOfWork unitOfWork, UserMapper userMapper, FriendshipMapper friendshipMapper, UserDataMapper userDataMapper)
	{
		_unitOfWork = unitOfWork;
		_userMapper = userMapper;
		_userDataMapper = userDataMapper;
		_friendshipMapper = friendshipMapper;
	}

	public async Task<IEnumerable<UserData>> GetAllAsync()
	{
		IEnumerable<User> users = await _unitOfWork.UserRepository.GetAllAsync();

		return _userDataMapper.ToDto(users);
	}

	public async Task<IEnumerable<UserDto>> GetFilteredUsers(string search)
	{
		IEnumerable<User> filteredUsers = await _unitOfWork.UserRepository.GetFilteredUsers(search);

		return _userMapper.ToDto(filteredUsers);
	}

	public async Task<UserDto> UpdateRole(HandleUser handleRole)
	{
		User userEntity = await _unitOfWork.UserRepository.GetByIdAsync(handleRole.UserId) ?? throw new Exception("El usuario no existe");
		userEntity.Role = handleRole.Role;
		userEntity.IsBanned = handleRole.IsBanned;

		_unitOfWork.UserRepository.Update(userEntity);

		await _unitOfWork.UserRepository.SaveAsync();

		return _userMapper.ToDto(userEntity);
	}

	public async Task<bool> DeleteUserById(long id)
	{
		User user = await _unitOfWork.UserRepository.GetByIdAsync(id);
		_unitOfWork.UserRepository.Delete(user);

		return await _unitOfWork.SaveAsync();
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
}
