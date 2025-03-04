using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using Backend.Helpers;
using Backend.Models;

namespace Backend.WebSockets;

public class WebSocketLink : IDisposable
{

  //VARIABLES INICIALES
  private const int BUFFER_SIZE = 4096;

  private readonly WebSocket _webSocket;
  private readonly byte[] _buffer;

  public long Id { get; init; }
  public bool IsOpen => _webSocket.State == WebSocketState.Open;
  public ConnectionState ConnectionState { get; set; }

  //EVENTOS
  public event Func<WebSocketLink, Task> Disconnected;
  public event Func<WebSocketLink, string, Task> FriendRequest;
  public event Func<WebSocketLink, string, Task> MatchmakingRequest;
  public event Func<WebSocketLink, string, Task> GameBotEvent;

	//CONSTRUCTOR
	public WebSocketLink(long id, WebSocket webSocket)
	{
		_buffer = new byte[BUFFER_SIZE];
		_webSocket = webSocket;

		Id = id;
		ConnectionState = IsOpen ? ConnectionState.Online : ConnectionState.Offline;
	}

	public async Task HandleEventAsync() {
    while (IsOpen)
    {
      string message = await ReadAsync();
      Debug.WriteLine("mensaje websocket" + message);

      if (!string.IsNullOrWhiteSpace(message)) await InvokeEvents(message);
		}

    if (Disconnected != null)
    {
			ConnectionState = ConnectionState.Offline;
			await Disconnected.Invoke(this);
    }
  }
     
  public async Task<string> ReadAsync() 
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
        return string.Empty;
      }
    }
    while (!receiveResult.EndOfMessage);

    return Encoding.UTF8.GetString(stream.ToArray());
  }

  public async Task SendAsync(string message)
  {
    if (IsOpen)
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

  private async Task InvokeEvents(string message)
  {
    string type = GetMessageType(message);

		switch (type)
    {
      case "FriendRequest":
        if (FriendRequest != null) await FriendRequest.Invoke(this, message);
        break;
      case "MatchmakingRequest":
        if (MatchmakingRequest != null) await MatchmakingRequest.Invoke(this, message);
        break;
      case "GameBotEvent":
        if (GameBotEvent != null) await GameBotEvent.Invoke(this, message);
        break;
    }
  }
  private string GetMessageType(string jsonString)
  {
		IMessage<object> message = ParseHelper.DesGenericMessage<object>(jsonString);
    return message.MessageType;
  }

	public override bool Equals(object obj)
	{
    return obj is WebSocketLink link && link.Id == Id;
	}

	public override int GetHashCode()
	{
		return Id.GetHashCode();
	}
}