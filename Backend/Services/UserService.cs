using Backend.Models;
using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.DTOs.Auth;

namespace Backend.Services;

public class UserService
{
  private readonly UnitOfWork _unitOfWork;

  public UserService(UnitOfWork unitOfWork)
  {
    _unitOfWork = unitOfWork;
  }

  public async Task<User> GetByLoginData(LoginRequest loginData)
  {
    string hashedPassword = AuthService.HashPassword(loginData.Password);
    //Mover ese "throw" a la función del authService
    return await _unitOfWork.UserRepository.GetByLoginData(loginData.Identifier, hashedPassword) ?? throw new UnauthorizedAccessException();
  }

  public async Task<User> InsertUser(RegisterRequest userRequest)
  {
    User newUser = new User {
      Username = userRequest.Username,
      Mail = userRequest.Mail,
      Password = AuthService.HashPassword(userRequest.Password),
      Avatar = userRequest.Avatar,
      Role = null,
      State = UserState.Offline
    };

    return await _unitOfWork.UserRepository.InsertAsync(newUser);
  }
}