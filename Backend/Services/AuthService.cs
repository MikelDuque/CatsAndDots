using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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
  private readonly UserService _userService;

  public AuthService(UnitOfWork unitOfWork, IOptionsMonitor<JwtBearerOptions> jwtOptions, UserService userService)
  {
    _unitOfWork = unitOfWork;
    _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
    _userService = userService;
  }

  public void ProcessWithLogin(LoginRequest model)
  {
    //Comprobar si existe el usuario
    //Si existe, comprobar si coincide la contraseña

    //Según cuál sea el caso, enviar una excpción u otra
  }

  public async Task<string> Login(LoginRequest model)
  {
    //Cambiar esta función por aquellla que devuellve el usuario por el nombre/mail
    User user = await _userService.GetByLoginData(model);

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

  public async Task<string> Register(RegisterRequest userData)
  {
      
    LoginRequest model = new LoginRequest {
      Identifier = userData.Mail,
      Password = userData.Password,
    };

    await _userService.InsertUser(userData);

    return await Login(model);
  }

  /* OTROS MÉTODOS */
  public static string HashPassword(string password)
  {
    byte[] inputBytes = Encoding.UTF8.GetBytes(password);
    byte[] inputHash = SHA256.HashData(inputBytes);
    return Encoding.UTF8.GetString(inputHash);
  }
}
