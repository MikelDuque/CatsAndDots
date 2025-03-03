using System.Net.WebSockets;
using System.Runtime.Serialization.Json;
using System.Text.Json;
using Backend.WebSockets;
using Backend.WebSockets.Messages;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Backend.Helpers;

public static class ParseHelper
{
  public static JsonSerializerOptions Options => new ()
  {
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
  };

  public static JsonSerializerOptions OtherOptions => new()
  {
    PropertyNameCaseInsensitive = true
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

  public static IMessage<T> DesGenericMessage<T>(string jsonObject) where T: class
  {
    return JsonSerializer.Deserialize<Message<T>>(jsonObject, OtherOptions);
  }

  public static T DesMessage<T>(string jsonObject) where T: class
  {
    return JsonSerializer.Deserialize<T>(jsonObject, OtherOptions);
  }
}
