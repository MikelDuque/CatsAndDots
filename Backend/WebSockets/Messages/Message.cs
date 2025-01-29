namespace Backend.WebSockets.Messages;

public abstract class Message<TBody> : IMessage<TBody> where TBody : class
{
  public string MessageType { get; set; }
  public TBody Body { get; set; }
}
