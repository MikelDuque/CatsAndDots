using System.Security.Claims;
using Backend.Models.DTOs.Auth;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : Controller
{
	private readonly UserService _userService;

	public UserController(UserService userService)
	{
		_userService = userService;
	}

	[HttpGet("FriendList/{id}")]
	public async Task<ActionResult> GetFriendList(long id)
	{
		Claim userClaimId = User.FindFirst("id");
		if (userClaimId == null) return Unauthorized(new { Message = "Debe iniciar sesión para llevar a cabo esta acción" });

		if (id <= 0) return BadRequest(new { Message = "El ID del usuario es inválido." });

		return Ok(await _userService.GetFriendList(id));
	}

	[HttpGet("PendingFriendList/{id}")]
	public async Task<ActionResult> GetPendingFriends(long id)
	{
		Claim userClaimId = User.FindFirst("id");
		if (userClaimId == null) return Unauthorized(new { Message = "Debe iniciar sesión para llevar a cabo esta acción" });

		if (id <= 0) return BadRequest(new { Message = "El ID del usuario es inválido." });

		return Ok(await _userService.GetPendingFriends(id));
	}
}
