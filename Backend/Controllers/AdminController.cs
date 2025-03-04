using Backend.Models.DTOs.User;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
	private readonly UserService _userService;

	public AdminController(IOptionsMonitor<JwtBearerOptions> jwtOptions, UserService userService)
	{
		_userService = userService;
	}

	[HttpGet("Get_Users")]
	public async Task<ActionResult> GetAllAsync()
	{
		Claim userClaimId = User.FindFirst("id");
		if (userClaimId == null) return Unauthorized(new { Message = "Debe iniciar sesión para llevar a cabo esta acción" });

		return Ok(await _userService.GetAllAsync());
	}

	[HttpPut("Handle_User")]
	public async Task<ActionResult<UserDto>> UpdateUserRole([FromBody] HandleUser userRole)
	{
		Claim userClaimId = User.FindFirst("id");
		if (userClaimId == null) return Unauthorized(new { Message = "Debes iniciar sesión para llevar a cabo esta acción" });

		if (userRole == null) return BadRequest(new { Message = "El role a actualizar es inválido." });
		return Ok(await _userService.UpdateRole(userRole));
	}

	[HttpDelete("Delete_User/{id}")]
	public async Task<ActionResult> DeleteAsyncUser(long id)
	{
		Claim userClaimId = User.FindFirst("id");
		if (userClaimId == null) return Unauthorized(new { Message = "Debes iniciar sesión para llevar a cabo esta acción" });

		if (id <= 0) return BadRequest(new { Message = "El ID del usuario es inválido." });
		return Ok(await _userService.DeleteUserById(id));
	}
}