namespace Backend.WebSockets;

public interface IMessage<TBody> 
{
  public Header Header { get; set; }
  public TBody Body { get; set; }
}

public class Header
{
  string EventType { get; set; }
  long SourceId { get; set; }
  long[] DestinationIds { get; set; }
}