using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CentricBackend.Models
{
    public class Movimiento
    {
        [Key]
        public Guid MovimientoId { get; set; }

        public DateTime Fecha { get; set; }

        [Required, MaxLength(50)]
        public string TipoMovimiento { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Saldo { get; set; }

        // Relación
        public Guid CuentaId { get; set; }
        [ForeignKey("CuentaId")]
        public Cuenta Cuenta { get; set; } = null!;
    }
}