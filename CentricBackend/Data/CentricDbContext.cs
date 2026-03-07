using CentricBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CentricBackend.Data
{
    public class CentricDbContext : DbContext
    {
        public CentricDbContext(DbContextOptions<CentricDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Cuenta> Cuentas { get; set; }
        public DbSet<Movimiento> Movimientos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Restricción de borrado en cascada para proteger el historial financiero
            modelBuilder.Entity<Cuenta>()
                .HasMany(c => c.Movimientos)
                .WithOne(m => m.Cuenta)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}