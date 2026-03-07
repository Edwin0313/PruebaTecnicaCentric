using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CentricBackend.Models
{
    public class Cuenta
    {
        [Key]
        public Guid CuentaId { get; set; }

        [Required, MaxLength(20)]
        public string NumeroCuenta { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string TipoCuenta { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal SaldoInicial { get; set; }

        public bool Estado { get; set; }

        // Relación
        public Guid ClienteId { get; set; }
        [ForeignKey("ClienteId")]
        public Cliente Cliente { get; set; } = null!;

        public ICollection<Movimiento> Movimientos { get; set; } = new List<Movimiento>();
    }
}