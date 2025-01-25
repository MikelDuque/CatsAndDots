using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database;

public class DataContext : DbContext
{
    public const string DATABASE_PATH = "CatsAndDotsDB.db";

    public DbSet<User> Users {get; set;}
    public DbSet<UserFriend> UserFriendships {get; set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        /*
        optionsBuilder.LogTo(Console.WriteLine);
        optionsBuilder.EnableSensitiveDataLogging();
        */
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

        #if DEBUG
            optionsBuilder.UseSqlite($"DataSource={baseDir}{DATABASE_PATH}");
        #else
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        #endif
    }
}
