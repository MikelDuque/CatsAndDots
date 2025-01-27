using Backend.Models.Database.Entities;
using Backend.Models.Database;
using Backend.Models;

namespace Backend.Services;

public class UserService
{

	private readonly UnitOfWork _unitOfWork;

	public UserService(UnitOfWork unitOfWork)
	{
		_unitOfWork = unitOfWork;
	}

	public async Task<User> ChangeUserState(long userId, UserState userState)
	{
		User thisUser = await _unitOfWork.UserRepository.GetByIdAsync(userId);

		thisUser.State = userState;

		return _unitOfWork.UserRepository.Update(thisUser);
	}
}
