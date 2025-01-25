using Backend.Models.Database.Entities;
using Backend.Models.DTOs;

namespace Backend.Models.Mappers;

public class FriendMapper
{
    //TO DTO
    public FriendDto ToDto(User friend)
    {
        return new FriendDto
        {
            Username = friend.Username,
            Avatar = friend.Avatar,
            State = (int)friend.State
        };
    }

    public IEnumerable<FriendDto> ToDto(IEnumerable<User> friends) 
    {
        return friends.Select(ToDto);
    }
}
