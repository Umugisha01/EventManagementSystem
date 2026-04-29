using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Services;
using RwandaEventHub.Models;
using Microsoft.AspNetCore.Identity;
using RwandaEventHub.Middleware;
using RwandaEventHub.Constants;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 1. Define CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<User, IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 4;
    options.User.RequireUniqueEmail = true;
});

// Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IVenueService, VenueService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IMomoService, MomoService>();
builder.Services.AddScoped<IQRService, QRService>();
builder.Services.AddScoped<IVerifyService, VerifyService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Enable Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed Admin User
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var adminEmail = "rwandaeventhub@gmail.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        adminUser = new User
        {
            FullName = "System Admin",
            Email = adminEmail,
            UserName = "admin",
            Role = AppConstants.Roles.Admin,
            IsActive = true,
            IsNewUser = false
        };
        await userManager.CreateAsync(adminUser, "Admin@1234");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Rwanda EventHub API V1");
    });
}

// PREMIUM LANDING PAGE (Redirects to Swagger)
app.MapGet("/", () => Results.Content(@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Rwanda EventHub | API Dashboard</title>
    <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap' rel='stylesheet'>
    <style>
        :root { --bg: #09090b; --card: #18181b; --primary: #3b82f6; --accent: #8b5cf6; --text: #fafafa; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .container { text-align: center; max-width: 650px; padding: 3rem; background: var(--card); border-radius: 32px; border: 1px solid #27272a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        h1 { font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(to right, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #a1a1aa; margin-bottom: 2.5rem; font-size: 1.1rem; }
        .btn { display: inline-block; padding: 1.2rem 2.5rem; background: linear-gradient(to right, var(--primary), var(--accent)); border-radius: 16px; text-decoration: none; color: var(--text); font-weight: 600; transition: 0.2s; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.6); }
        .status { margin-top: 2.5rem; font-size: 0.9rem; color: #10b981; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>Rwanda EventHub</h1>
        <p>Your API is ready for testing.</p>
        <a href='/swagger' class='btn'>Open Swagger UI</a>
        <div class='status'><div class='dot'></div> System Operational & Connected to SQL EXPRESS</div>
    </div>
</body>
</html>
", "text/html"));

// 2. Enable CORS (Must be before Authentication/Authorization)
app.UseCors("AllowViteFrontend");

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlerMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
