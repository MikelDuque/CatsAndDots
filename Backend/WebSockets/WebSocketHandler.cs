using System.Net.WebSockets;

namespace Backend.WebSockets;

public class WebSocketHandler : IDisposable
{
    private const int BUFFER_SIZE = 4096;

    private readonly WebSocket _webSocket;
    private readonly byte[] _buffer;

    public int Id { get; init; }
    public bool IsOpen => _webSocket.State == WebSocketState.Open;

    public event Func<WebSocketHandler, Task> Disconnected;

    public WebSocketHandler(int id, WebSocket webSocket)
    {
        Id = id;

        _webSocket = webSocket;
        _buffer = new byte[BUFFER_SIZE];
    }

    public async Task HandleAsync() {
        while (IsOpen) {
        //FUNCIONALIDAD MIENTRAS ESTÁ ABIERTO EL WEBSOCKET
        }

        if (Disconnected != null)
        {
            await Disconnected.Invoke(this);
        }
    }

    public void Dispose()
    {
        _webSocket.Dispose();
    }
}