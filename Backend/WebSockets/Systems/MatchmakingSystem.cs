using System.Text.Json;
using System.Collections.Concurrent;
using Backend.WebSockets.Messages;
using Backend.Helpers;
using Microsoft.Extensions.Hosting;

namespace Backend.WebSockets.Systems
{
  public class MatchmakingSystem
  {
    private readonly WebSocketNetwork _webSocketNetwork;
    private readonly ConcurrentQueue<WebSocketLink> _searchingPlayers = new();
    private readonly SemaphoreSlim _searchingPlayersSemaphore = new SemaphoreSlim(1, 1);
    private readonly ConcurrentDictionary<long, long> _pendingInvitations = new();

    public MatchmakingSystem(WebSocketNetwork webSocketNetwork)
    {
      _webSocketNetwork = webSocketNetwork;
    }

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
          long friendId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.ToString());
          await InviteFriendAsync(connectedUser, friendId);
          break;
        case "AcceptInvitation":
          long hostId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.ToString());
          await AcceptInvitationAsync(connectedUser, hostId);
          break;
        case "RejectInvitation":
          hostId = JsonSerializer.Deserialize<long>(matchmakingMessage.Body.ToString());
          await RejectInvitationAsync(connectedUser, hostId);
          break;
        default:
          await connectedUser.SendAsync(ParseHelper.GenericMessage("MatchmakingResponse", "Acción no reconocida."));
          break;
      }
    }

  
    public async Task SearchMatchAsync(WebSocketLink player)
    {
      await _searchingPlayersSemaphore.WaitAsync();
      try
      {
        _searchingPlayers.Enqueue(player);
        await TryMatchAsync();
      }
      finally
      {
        _searchingPlayersSemaphore.Release();
      }
      
    }

    private async Task TryMatchAsync()
    {
      if (_searchingPlayers.Count >= 2)
      {
        if (_searchingPlayers.TryDequeue(out WebSocketLink player1) &&
            _searchingPlayers.TryDequeue(out WebSocketLink player2))
        {
          await player1.SendAsync(ParseHelper.GenericMessage("MatchFound", new
          {
            Body = "Partida encontrada.",
            Role = "Host",
            OpponentId = player2.Id
          }));

          await player2.SendAsync(ParseHelper.GenericMessage("MatchFound", new
          {
            Body = "Partida encontrada.",
            Role = "Guest",
            OpponentId = player1.Id
          }));

          await _webSocketNetwork.StartMatchAsync(player1.Id, player2.Id);
        }
      }
    }

   
    public async Task CancelSearchAsync(WebSocketLink player)
    {
      await player.SendAsync(ParseHelper.GenericMessage("SearchCancelled", "Búsqueda cancelada."));


      var tempQueue = new ConcurrentQueue<WebSocketLink>();
      foreach (var p in _searchingPlayers)
      {
        if (p.Id != player.Id)
        {
          tempQueue.Enqueue(p);
        }
      }

      _searchingPlayers.Clear(); 

      while (!tempQueue.IsEmpty)
      {
        tempQueue.TryDequeue(out var p);
        _searchingPlayers.Enqueue(p); 
      }
    }

    public async Task InviteFriendAsync(WebSocketLink host, long friendId)
    {
      _pendingInvitations[host.Id] = friendId;

      await host.SendAsync(ParseHelper.GenericMessage("InvitationSent", $"Invitación enviada al amigo con ID {friendId}."));

    }

    public async Task AcceptInvitationAsync(WebSocketLink guest, long hostId)
    {
      if (_pendingInvitations.TryGetValue(hostId, out long storedGuestId) && storedGuestId == guest.Id)
      {
        _pendingInvitations.TryRemove(hostId, out _);
        await guest.SendAsync(ParseHelper.GenericMessage("MatchStarted", new
        {
          Body = "Partida iniciada.",
          Role = "Guest",
          OpponentId = hostId
        }));
        await _webSocketNetwork.StartMatchAsync(hostId, guest.Id);
      }
      
    }

    public async Task RejectInvitationAsync(WebSocketLink guest, long hostId)
    {
      if (_pendingInvitations.TryGetValue(hostId, out long storedGuestId) && storedGuestId == guest.Id)
      {
        _pendingInvitations.TryRemove(hostId, out _);
        await guest.SendAsync(ParseHelper.GenericMessage("InvitationRejected", "Invitación rechazada."));

      }

    }
  }
}
