using CentricBackend.Data;
using CentricBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CentricBackend.Endpoints
{
    public static class CentricEndpoints
    {
        public static void MapCentricEndpoints(this IEndpointRouteBuilder app)
        {
            // ==========================================
            // ENDPOINTS: CLIENTES
            // ==========================================
            var clientes = app.MapGroup("/api/clientes").WithTags("Clientes");

            clientes.MapGet("/", async (CentricDbContext db) => await db.Clientes.ToListAsync());

            clientes.MapGet("/{id}", async (Guid id, CentricDbContext db) =>
                await db.Clientes.FindAsync(id) is Cliente c ? Results.Ok(c) : Results.NotFound());

            clientes.MapPost("/", async (Cliente c, CentricDbContext db) => {
                c.ClienteId = Guid.NewGuid();
                db.Clientes.Add(c);
                await db.SaveChangesAsync();
                return Results.Created($"/api/clientes/{c.ClienteId}", c);
            });

            clientes.MapPut("/{id}", async (Guid id, Cliente input, CentricDbContext db) => {
                var c = await db.Clientes.FindAsync(id);
                if (c is null) return Results.NotFound();

                c.Nombres = input.Nombres; c.Direccion = input.Direccion;
                c.Telefono = input.Telefono; c.Contrasena = input.Contrasena; c.Estado = input.Estado;

                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            clientes.MapDelete("/{id}", async (Guid id, CentricDbContext db) => {
                var c = await db.Clientes.FindAsync(id);
                if (c is null) return Results.NotFound();
                db.Clientes.Remove(c);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            // ==========================================
            // ENDPOINTS: CUENTAS
            // ==========================================
            var cuentas = app.MapGroup("/api/cuentas").WithTags("Cuentas");

            cuentas.MapGet("/", async (CentricDbContext db) => await db.Cuentas.ToListAsync());

            cuentas.MapPost("/", async (Cuenta c, CentricDbContext db) => {
                c.CuentaId = Guid.NewGuid();
                db.Cuentas.Add(c);
                await db.SaveChangesAsync();
                return Results.Created($"/api/cuentas/{c.CuentaId}", c);
            });

            cuentas.MapPut("/{id}", async (Guid id, Cuenta input, CentricDbContext db) => {
                var c = await db.Cuentas.FindAsync(id);
                if (c is null) return Results.NotFound();

                c.NumeroCuenta = input.NumeroCuenta; c.TipoCuenta = input.TipoCuenta;
                c.Estado = input.Estado;
                // El Saldo Inicial no se debería actualizar una vez creada la cuenta por reglas contables

                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            cuentas.MapDelete("/{id}", async (Guid id, CentricDbContext db) => {
                var c = await db.Cuentas.FindAsync(id);
                if (c is null) return Results.NotFound();
                db.Cuentas.Remove(c);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            // ==========================================
            // ENDPOINTS: MOVIMIENTOS (Regla de Negocio)
            // ==========================================
            var movimientos = app.MapGroup("/api/movimientos").WithTags("Movimientos");

            movimientos.MapGet("/", async (CentricDbContext db) => await db.Movimientos.ToListAsync());

            movimientos.MapPost("/", async (Movimiento m, CentricDbContext db) => {
                var cuenta = await db.Cuentas.FindAsync(m.CuentaId);
                if (cuenta is null) return Results.BadRequest("La cuenta no existe.");

                // Obtener el último saldo registrado. Si no hay movimientos, tomar el Saldo Inicial.
                var ultimoMovimiento = await db.Movimientos
                    .Where(x => x.CuentaId == m.CuentaId)
                    .OrderByDescending(x => x.Fecha)
                    .FirstOrDefaultAsync();

                decimal saldoActual = ultimoMovimiento != null ? ultimoMovimiento.Saldo : cuenta.SaldoInicial;

                // Asumimos que el frontend enviará el Valor en negativo si es retiro, o en positivo si es depósito
                decimal nuevoSaldo = saldoActual + m.Valor;

                // Regla estricta solicitada en la prueba
                if (nuevoSaldo < 0)
                    return Results.BadRequest(new { Mensaje = "Saldo no disponible" });

                m.MovimientoId = Guid.NewGuid();
                m.Fecha = DateTime.UtcNow;
                m.Saldo = nuevoSaldo;

                db.Movimientos.Add(m);
                await db.SaveChangesAsync();

                return Results.Created($"/api/movimientos/{m.MovimientoId}", m);
            });

            // ==========================================
            // ENDPOINTS: REPORTES
            // ==========================================
            app.MapGet("/api/reportes", async (DateTime fechaInicio, DateTime fechaFin, Guid clienteId, CentricDbContext db) => {
                var reporte = await db.Movimientos
                    .Include(m => m.Cuenta)
                    .ThenInclude(c => c.Cliente)
                    .Where(m => m.Cuenta.ClienteId == clienteId && m.Fecha.Date >= fechaInicio.Date && m.Fecha.Date <= fechaFin.Date)
                    .Select(m => new {
                        Fecha = m.Fecha,
                        Cliente = m.Cuenta.Cliente.Nombres,
                        NumeroCuenta = m.Cuenta.NumeroCuenta,
                        Tipo = m.Cuenta.TipoCuenta,
                        SaldoInicial = m.Cuenta.SaldoInicial,
                        Estado = m.Cuenta.Estado,
                        Movimiento = m.Valor,
                        SaldoDisponible = m.Saldo
                    })
                    .OrderByDescending(r => r.Fecha)
                    .ToListAsync();

                return Results.Ok(reporte);
            }).WithTags("Reportes");
        }
    }
}