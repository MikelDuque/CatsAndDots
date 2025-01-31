
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace Backend.WebSockets;

public class WebSocketLink : IDisposable
{

  //VARIABLES INICIALES
  private const int BUFFER_SIZE = 4096;

  private readonly WebSocket _webSocket;
  private readonly byte[] _buffer;

  public long Id { get; init; }
  private ConnectionState ConnectionState { get; set;}


  //CONSTRUCTOR
  public WebSocketLink(long id, WebSocket webSocket)
  {
    Id = id;
    ConnectionState = ConnectionState.Online;

    _webSocket = webSocket;
    _buffer = new byte[BUFFER_SIZE];
  }

  //EVENTOS
  public event Func<WebSocketLink, string, Task> FriendRequest;
  public event Func<WebSocketLink, Task> Disconnected;

  public async Task HandleEventAsync() {
    while (ConnectionState == ConnectionState.Online)
    {
      string message = await ReadAsync();

      if (!string.IsNullOrWhiteSpace(message)) InvokeEvents(message);
		}

    if (Disconnected != null) await Disconnected.Invoke(this);
  }
     
  private async Task<string> ReadAsync() 
  {
    using MemoryStream stream = new();
    WebSocketReceiveResult receiveResult;

    do
    {
      receiveResult = await _webSocket.ReceiveAsync(_buffer, CancellationToken.None);

      if (receiveResult.MessageType == WebSocketMessageType.Text)
      {
          stream.Write(_buffer, 0, receiveResult.Count);
      }
      else if (receiveResult.CloseStatus.HasValue)
      {
          await _webSocket.CloseAsync(receiveResult.CloseStatus.Value, receiveResult.CloseStatusDescription, CancellationToken.None);
      }
    }
    while (!receiveResult.EndOfMessage);

    return Encoding.UTF8.GetString(stream.ToArray());
  }

  public async Task SendAsync(string message)
  {
    if (ConnectionState == ConnectionState.Online)
    {
      byte[] bytes = Encoding.UTF8.GetBytes(message);
      await _webSocket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
    }
  }

  public void Dispose()
  {
    ConnectionState = ConnectionState.Offline;
    _webSocket.Dispose();
  }

  private async void InvokeEvents(string message)
  {
    string type = GetMessageType(message);

    switch (type)
    {
      case "FriendRequest":
        if (FriendRequest != null) await FriendRequest.Invoke(this, message);
        break;
    }
  }

  private string GetMessageType(string JsonObject)
  {
    IMessage<Object> message = JsonSerializer.Deserialize<IMessage<Object>>(JsonObject);

    return message.MessageType;
  }
}