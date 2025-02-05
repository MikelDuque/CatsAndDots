namespace Backend.WebSockets;

public interface IMessage<TBody> where TBody : class
{
  string MessageType { get; }
  TBody Body { get; set; }
}