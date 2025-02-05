using System.Text.Json;
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

  /*
  private string FirstCharToLower(string str)
  {
    if(string.IsNullOrWhiteSpace(str) || char.IsLower(str[0])) return str;

    char firstChar = char.ToLower(str[0]);

    return str.Length == 1 ? firstChar.ToString() : firstChar + str[1..];
  }
  */
}
