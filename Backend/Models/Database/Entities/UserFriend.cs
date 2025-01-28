using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Entities
{
  [PrimaryKey(nameof(UserAId), nameof(UserBId))]
  public class UserFriend
  {
    public bool IsFriendship { get; set; }
    public User Sender { get; set; }

    /* RELACIÓN N:M */
    [ForeignKey(nameof(UserA))]
    public required long UserAId { get; set; }
    public User UserA { get; set; }

    [ForeignKey(nameof(UserB))]
    public required long UserBId { get; set; }
    public User UserB { get; set; }
  }
}
