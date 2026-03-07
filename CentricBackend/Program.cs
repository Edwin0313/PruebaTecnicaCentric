using CentricBackend.Data;
using Microsoft.EntityFrameworkCore;
using CentricBackend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la inyección del DbContext
builder.Services.AddDbContext<CentricDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configurar servicios de Swagger (Documentación de la API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Configurar CORS para permitir que el frontend de Angular se conecte
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseHttpsRedirection();

app.MapCentricEndpoints();
app.Run();