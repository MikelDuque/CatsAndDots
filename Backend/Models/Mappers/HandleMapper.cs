using System.Net.WebSockets;
using Backend.Models.Database.Entities;
using Backend.Models.DTOs;
using Backend.WebSockets;

namespace Backend.Models.Mappers;

public class HandlerMapper
{
    //TO DTO
    public WebSocketHandler2 ToDto(User user, WebSocket websocket)
    {
        return new WebSocketHandler2(user.Id, websocket)
        {
            Username = user.Username,
            Avatar = user.Avatar
        };
    }

    public IEnumerable<WebSocketHandler2> ToDto(IEnumerable<User> users, WebSocket websocket) 
    {
        return users.Select(user => ToDto(user, websocket));
    }
}
