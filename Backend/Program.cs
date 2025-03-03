
using System.Text;
using System.Text.Json.Serialization;
using Backend.Models.Database;
using Backend.Models.Database.Repositories;
using Backend.Models.Mappers;
using Backend.Services;
using Backend.WebSockets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

namespace Backend;

public class Program
{
  public static void Main(string[] args)
  {
    Directory.SetCurrentDirectory(AppContext.BaseDirectory);

    var builder = WebApplication.CreateBuilder(args);    

    //SERVICES
    builder.Services.AddControllers();
    builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
    builder.Services.AddControllers().AddJsonOptions(options => {options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;});

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddSwaggerGen(options =>
    {
        options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
        {
            BearerFormat = "JWT",
            Name = "Authorization",
            Description = "Ajusta cosas del JWTBearer",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme
        });
        options.OperationFilter<SecurityRequirementsOperationFilter>(true, JwtBearerDefaults.AuthenticationScheme);
    });
    builder.Services.AddAuthentication().AddJwtBearer(options =>
    {
        Settings settings = builder.Configuration.GetSection(Settings.SECTION_NAME).Get<Settings>()!;
        string key = Environment.GetEnvironmentVariable("JWT_KEY");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    });

    //Websockets
		builder.Services.AddSingleton<WebSocketNetwork>();
		builder.Services.AddTransient<WebSocketMiddleware>();

		//Database
		builder.Services.AddScoped<DataContext>();
    builder.Services.AddScoped<UnitOfWork>();

    //Repositorios
    builder.Services.AddScoped<UserRepository>();
    builder.Services.AddScoped<UserFriendshipRepository>();

		//Mappers
		builder.Services.AddScoped<UserMapper>();
    builder.Services.AddScoped<FriendshipMapper>();

		//Servicios
    builder.Services.AddScoped<AuthService>();
    builder.Services.AddScoped<UserService>();


    var app = builder.Build();

    SeedDatabase(app.Services);

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"))
    });

		app.UseHttpsRedirection();
		app.UseRouting();
		app.UseCors(options =>
	    options.AllowAnyHeader()
		    .AllowAnyMethod()
		    .AllowAnyOrigin()
    );

		app.UseWebSockets();
		app.UseMiddleware<WebSocketMiddleware>();

		app.UseAuthentication();
		app.UseAuthorization();

		app.MapControllers();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.Run();
  }

  private static void SeedDatabase(IServiceProvider serviceProvider)
  {
    using IServiceScope scope = serviceProvider.CreateScope();
    using DataContext dbContext = scope.ServiceProvider.GetService<DataContext>();

    if (dbContext.Database.EnsureCreated())
    {
      Seeder seeder = new Seeder(dbContext);
      seeder.SeedAll();
    }
  }
}