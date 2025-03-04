using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Entities;

[PrimaryKey(nameof(UserAId), nameof(UserBId))]
public class UserFriendship
{
  public DateTime? WhenFriendship { get; set; }

  /* RELACIÓN N:M */
  [ForeignKey(nameof(UserA))]
  public required long UserAId { get; set; }
  public User UserA { get; set; }

  [ForeignKey(nameof(UserB))]
  public required long UserBId { get; set; }
  public User UserB { get; set; }
}
