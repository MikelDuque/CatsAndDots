using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;

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

	public async Task<IEnumerable<FriendDto>> GetFriendList(long userId)
	{
		User thisUser = await _unitOfWork.UserRepository.GetByIdAsync(userId);

		return _friendMapper.ToDto(thisUser.Friends);
	}
}
