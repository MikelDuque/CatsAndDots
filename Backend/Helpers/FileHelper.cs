namespace Backend.Helpers;

public class FileHelper
{
  public static async Task<string> SaveAvatar(IFormFile image, string username)
  {
    string defaultImage = "Default-Avatar.png";

    string fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
    string fileName = username.ToLowerInvariant() + fileExtension;

    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ProfilePictures", image == null ? defaultImage : fileName);

    using (var stream = new FileStream(filePath, FileMode.Create))
    {
      await image.CopyToAsync(stream);
    }

    return $"/ProfilePictures/{(image == null ? defaultImage : fileName)}";
  }
}