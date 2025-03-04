using System.Text.Json;
using Backend.Models.DTOs;
using Backend.WebSockets;
using Backend.WebSockets.Messages;

namespace Backend.Helpers;

public static class ParseHelper
{
  public static JsonSerializerOptions Options => new ()
  {
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
  };
  
  public static string GenericMessage<T>(string type, T body) where T : class
  {
    IMessage<T> message = new Message<T>() {
      MessageType = type,
      Body = body
    };

    return JsonSerializer.Serialize(message, Options);
  }

  public static string Message<T>(IMessage<T> message) where T : class
  {
    return JsonSerializer.Serialize(message, Options);
  }

  public static (int TipoLinea, int Num1, int Num2) ParseMove(string message)
  {
    var data = JsonSerializer.Deserialize<MoveData>(message);
    return (data.TipoLinea, data.Num1, data.Num2);
  }
}
