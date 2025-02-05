using System.Text.Json;
using System.Collections.Concurrent;
using Backend.WebSockets.Messages;

namespace Backend.WebSockets.Systems
{
  public class MatchmakingSystem
  {
   
    private readonly ConcurrentQueue<WebSocketLink> _searchingPlayers = new();
    private readonly ConcurrentDictionary<long, long> _pendingInvitations = new();
    public async Task HandleMatchmakingAsync(WebSocketLink connectedUser, string message)
    {
      
      MatchmakingMessage matchmakingMessage = JsonSerializer.Deserialize<MatchmakingMessage>(message);

      switch (matchmakingMessage.Body.Action)
      {
        case "Random":
          await SearchMatchAsync(connectedUser);
          break;
        case "CancelRandom":
          await CancelSearchAsync(connectedUser);
          break;
        case "InviteFriend":
          // El Body debería contener el ID del amigo (por ejemplo, un número).
          long friendId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.ToString());
          await InviteFriendAsync(connectedUser, friendId);
          break;
        case "AcceptInvitation":
          // El Body contiene el ID del host que envió la invitación.
          long hostId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.ToString());
          await AcceptInvitationAsync(connectedUser, hostId);
          break;
        case "RejectInvitation":
          await RejectInvitationAsync(connectedUser);
          break;
        default:
          // Si la acción no es reconocida, se puede notificar al cliente.
          await connectedUser.SendAsync(JsonSerializer.Serialize(new
          {
            MessageType = "MatchmakingResponse",
            Body = "Acción no reconocida."
          }));
          break;
      }
    }

  
    public async Task SearchMatchAsync(WebSocketLink player)
    {
      _searchingPlayers.Enqueue(player);
      await TryMatchAsync();
    }

    private async Task TryMatchAsync()
    {
      if (_searchingPlayers.Count >= 2)
      {
        if (_searchingPlayers.TryDequeue(out WebSocketLink player1) &&
            _searchingPlayers.TryDequeue(out WebSocketLink player2))
        {
          await player1.SendAsync(JsonSerializer.Serialize(new
          {
            MessageType = "MatchFound",
            Body = "Partida encontrada.",
            Role = "Host",
            OpponentId = player2.Id
          }));
          await player2.SendAsync(JsonSerializer.Serialize(new
          {
            MessageType = "MatchFound",
            Body = "Partida encontrada.",
            Role = "Guest",
            OpponentId = player1.Id
          }));
        }
      }
    }

   
    public async Task CancelSearchAsync(WebSocketLink player)
    {
      // Se puede implementar una lógica adicional para "ignorar" al jugador si ya está en cola.
      await player.SendAsync(JsonSerializer.Serialize(new
      {
        MessageType = "SearchCancelled",
        Body = "Búsqueda cancelada."
      }));
    }

    public async Task InviteFriendAsync(WebSocketLink host, long friendId)
    {
      await host.SendAsync(JsonSerializer.Serialize(new
      {
        MessageType = "InvitationSent",
        Body = $"Invitación enviada al amigo con ID {friendId}."
      }));
    }

    public async Task AcceptInvitationAsync(WebSocketLink guest, long hostId)
    {
      await guest.SendAsync(JsonSerializer.Serialize(new
      {
        MessageType = "MatchStarted",
        Body = "Partida iniciada.",
        Role = "Guest",
        OpponentId = hostId
      }));
    }

    public async Task RejectInvitationAsync(WebSocketLink guest)
    {
      await guest.SendAsync(JsonSerializer.Serialize(new
      {
        MessageType = "InvitationRejected",
        Body = "Invitación rechazada."
      }));
    }
  }
}
