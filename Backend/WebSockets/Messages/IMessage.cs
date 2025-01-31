namespace Backend.WebSockets;

public interface IMessage<TBody> where TBody : class
{
  string MessageType { get; set; }
  TBody Body { get; set; }
}

/*
public class Header
{
  string EventType { get; set; }
  long SourceId { get; set; }
  long[] DestinationIds { get; set; }
}
*/