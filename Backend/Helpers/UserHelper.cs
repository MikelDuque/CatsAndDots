using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.Mappers;

namespace Backend.Helpers;

public class UserHelper
{
  public static async Task<UserDto> GetUserDto(IServiceScopeFactory scopeFactory, long userId)
	{
		using IServiceScope serviceScope = scopeFactory.CreateScope();
		UnitOfWork unitOfWork = serviceScope.ServiceProvider.GetService<UnitOfWork>();
		UserMapper userMapper = serviceScope.ServiceProvider.GetService<UserMapper>();

		User user = await unitOfWork.UserRepository.GetByIdAsync(userId);

		return userMapper.ToDto(user);
	}

}