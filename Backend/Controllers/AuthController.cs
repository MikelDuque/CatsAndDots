using Backend.Models.DTOs;
using Backend.Models.DTOs.Auth;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TokenValidationParameters _tokenParameters;
    private readonly AuthService _authService;

    public AuthController(IOptionsMonitor<JwtBearerOptions> jwtOptions, AuthService authService)
    {
        _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
        _authService = authService;
    }

    [HttpPost("Login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest model)
    {
        if (model == null) return BadRequest(new {Message= "Los datos de usuario son inválidos."});

        try
        {
            string stringToken = await _authService.ProcessWithLogin(model);
            return Ok(new LoginResult { AccessToken = stringToken });
        }
        catch (UnauthorizedAccessException errorAuth)
        {
            return Unauthorized(new {Message = errorAuth.ToString()});
        }
    }

    [HttpPost("Register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest userRequest)
    {
        if (userRequest == null) return BadRequest(new {Message= "Los datos de usuario son inválidos."});

        try
        {
            string stringToken = await _authService.Register(userRequest);
            return Ok(new LoginResult { AccessToken = stringToken });
        }
        catch (Exception error)
        {
            return BadRequest(new {Message = error.ToString()});
        }
        
    }
}