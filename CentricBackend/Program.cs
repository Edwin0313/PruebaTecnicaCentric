using CentricBackend.Data;
using Microsoft.EntityFrameworkCore;
using CentricBackend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CentricDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseCors("AllowAngular");
//app.UseHttpsRedirection();

app.MapCentricEndpoints();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<CentricDbContext>();
        // Esto creará la base de datos y las tablas según tus modelos
        context.Database.EnsureCreated();
        Console.WriteLine("Conexión exitosa: CentricDB ha sido verificada/creada.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al inicializar la base de datos: {ex.Message}");
    }
}
app.Run();