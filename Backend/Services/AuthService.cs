using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Models;
using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.Models.DTOs.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services;

public class AuthService
{
  private readonly UnitOfWork _unitOfWork;
  private readonly TokenValidationParameters _tokenParameters;

  public AuthService(UnitOfWork unitOfWork, IOptionsMonitor<JwtBearerOptions> jwtOptions)
  {
    _unitOfWork = unitOfWork;
    _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
  }

  public async Task<string> Register(RegisterRequest userData)
  {
    User newUser = new User {
      Username = userData.Username,
      Mail = userData.Mail,
      Password = HashPassword(userData.Password),
      Avatar = userData.Avatar,
      Role = null,
      State = UserState.Offline //Cambiar cuando hagamos lo de los sockets
    };

    if (_unitOfWork.UserRepository.GetByMailOrUsername(newUser.Mail) != null) throw new Exception("El usuario ya se encuentra registrado");

    User registeredUser = await _unitOfWork.UserRepository.InsertAsync(newUser) ?? throw new Exception("Error al registrar el usuario");

    return Login(registeredUser);
  }

  public async Task<string> ProcessWithLogin(LoginRequest model)
  {
    User loggedUser = await _unitOfWork.UserRepository.GetByMailOrUsername(model.Identifier) ?? throw new UnauthorizedAccessException("El usuario introducido no existe");
    
    if (loggedUser.Password != HashPassword(model.Password)) throw new UnauthorizedAccessException("Usuario o contraseña incorrectos");

    return Login(loggedUser);
  }

  public string Login(User user)
  {
    SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
    {
      Claims = new Dictionary<string, object>
      {
        { "id", user.Id },
        { ClaimTypes.Name, user.Username},
        { ClaimTypes.Email, user.Mail },
        { ClaimTypes.Role, user.Role },
      },

      Expires = DateTime.UtcNow.AddHours(1),

      SigningCredentials = new SigningCredentials(
      _tokenParameters.IssuerSigningKey,
      SecurityAlgorithms.HmacSha256Signature)
    };

    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
    string stringToken = tokenHandler.WriteToken(token);

    return stringToken;
  }

  /* OTROS MÉTODOS */
  public static string HashPassword(string password)
  {
    byte[] inputBytes = Encoding.UTF8.GetBytes(password);
    byte[] inputHash = SHA256.HashData(inputBytes);
    return Encoding.UTF8.GetString(inputHash);
  }
}
