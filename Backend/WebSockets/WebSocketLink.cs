
using System.Net.WebSockets;
using System.Text;
using Backend.Models;

namespace Backend.WebSockets;

public class WebSocketLink : IDisposable
{

  //VARIABLES INICIALES
  private const int BUFFER_SIZE = 4096;

  private readonly WebSocket _webSocket;
  private readonly byte[] _buffer;

  public long Id { get; init; }
  public ConnectionState connectionState { get; set; }


  //CONSTRUCTOR
  public WebSocketLink(long id, WebSocket webSocket)
  {
    Id = id;
    connectionState = ConnectionState.Online;

    _webSocket = webSocket;
    _buffer = new byte[BUFFER_SIZE];
  }

  //EVENTOS
  public event Func<WebSocketLink, string, Task> MessageRecived;
  public event Func<WebSocketLink, string, Task> FriendRequest;
  public event Func<WebSocketLink, Task> Disconnected;

  public async Task HandleEventAsync() {
    while (connectionState == ConnectionState.Online)
    {
      string message = await ReadAsync();

      if (string.IsNullOrEmpty(message)) { break; }

      if (MessageRecived != null)
			{
				await MessageRecived.Invoke(this, message);
			}
      
      if (FriendRequest != null)
			{
        await FriendRequest.Invoke(this, message);
			}
		}

    if (Disconnected != null)
    {
      await Disconnected.Invoke(this);
    }
  }
     
  private async Task<string> ReadAsync() 
  {
    using MemoryStream stream = new MemoryStream();
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
    if (connectionState == ConnectionState.Online)
    {
      byte[] bytes = Encoding.UTF8.GetBytes(message);
      await _webSocket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
    }
  }

  public void Dispose()
  {
    connectionState = ConnectionState.Offline;
    _webSocket.Dispose();
  }
}