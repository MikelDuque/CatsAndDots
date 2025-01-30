using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Helpers;
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
    if (await _unitOfWork.UserRepository.GetByMailOrUsername(userData.Username.ToLowerInvariant()) != null) throw new Exception("El usuario ya se encuentra registrado");

    User newUser = new User {
      Username = userData.Username.ToLowerInvariant(),
      Mail = userData.Mail.ToLowerInvariant(),
      Password = HashHelper.Hash(userData.Password),
      Avatar = await FileHelper.SaveAvatar(userData.Avatar, userData.Username),
      Role = null
    };

    User registeredUser = await _unitOfWork.UserRepository.InsertAsync(newUser) ?? throw new Exception("Error al registrar el usuario");
    await _unitOfWork.SaveAsync();

    return Login(registeredUser);
  }

  public async Task<string> ProceedWithLogin(LoginRequest model)
  {
    User loggedUser = await _unitOfWork.UserRepository.GetByMailOrUsername(model.Identifier) ?? throw new UnauthorizedAccessException("El usuario introducido no existe");
    
    if (loggedUser.Password != HashHelper.Hash(model.Password)) throw new UnauthorizedAccessException("Usuario o contraseña incorrectos");

    return Login(loggedUser);
  }

  private string Login(User user)
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

      SigningCredentials = new SigningCredentials(_tokenParameters.IssuerSigningKey, SecurityAlgorithms.HmacSha256Signature)
    };

    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
    string stringToken = tokenHandler.WriteToken(token);

    return stringToken;
  }

  public async Task<long> GetUserIdFromToken(string token)
  {
    try
    {
			JwtSecurityTokenHandler tokenHandler = new();

			TokenValidationResult decodedToken = await tokenHandler.ValidateTokenAsync(token, _tokenParameters);

			IDictionary<string, object> claims = decodedToken.Claims;

      if (claims.TryGetValue("id", out object id)) return Convert.ToInt64(id);

      throw new SecurityTokenValidationException("No se ha podido obtener el ID de usuario");
		}
    catch (SecurityTokenValidationException)
    {
			throw;
		}
	}
}
