using System.Globalization;
using System.Net.WebSockets;
using System.Text;

namespace Backend.WebSockets;

public class WebSocketHandler : IDisposable
{
    private const int BUFFER_SIZE = 4096;

    private readonly WebSocket _webSocket;
    private readonly byte[] _buffer;

    public int Id { get; init; }
    public bool IsOpen => _webSocket.State == WebSocketState.Open;

    public event Func<WebSocketHandler, string, Task> MessageRecived;
    public event Func<WebSocketHandler, Task> Disconnected;

    public WebSocketHandler(int id, WebSocket webSocket)
    {
        Id = id;

        _webSocket = webSocket;
        _buffer = new byte[BUFFER_SIZE];
    }

    public async Task HandleAsync() {
        while (IsOpen) {
            //FUNCIONALIDAD MIENTRAS EST� ABIERTO EL WEBSOCKET
            string message = await ReadAsync();

            if (!string.IsNullOrWhiteSpace(message)&& MessageRecived != null) 
            {
                await MessageRecived.Invoke(this, message);
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
        if (IsOpen)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(message);
            await _webSocket.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    public void Dispose()
    {
        _webSocket.Dispose();
    }
}