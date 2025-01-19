﻿using Backend.Models.DTOs;
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
    private readonly UserService _userService;
    private readonly AuthService _authService;

    public AuthController(IOptionsMonitor<JwtBearerOptions> jwtOptions, UserService userService, AuthService authService)
    {
        _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
        _userService = userService;
        _authService = authService;
    }

    [HttpPost("Login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest model)
    {
        if (model == null) return BadRequest(new {Message= "Los datos de usuario son inválidos."});

        try
        {
            string stringToken = await _authService.Login(model);
            return Ok(new LoginResult { AccessToken = stringToken });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new {Message = "El mail, nombre de usuario o contraseña introducidos son incorrectos"});
        }
    }

    [HttpPost("Register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest userRequest)
    {
        if (userRequest == null) return BadRequest(new {Message= "Los datos de usuario son inválidos."});

        if (await _userService.GetByMailOrUsername(userRequest.Mail) != null)
        {
            return BadRequest(new {message = "El usuario ya existe"});
        }

        string stringToken = await _authService.Register(userRequest);
        return Ok(new LoginResult { AccessToken = stringToken });
    }
}