using System.ComponentModel.DataAnnotations;

namespace CentricBackend.Models
{
    public class Cliente
    {
        [Key]
        public Guid ClienteId { get; set; }

        [Required, MaxLength(100)]
        public string Nombres { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Direccion { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        public string Contrasena { get; set; } = string.Empty;

        public bool Estado { get; set; }

        // Navegación
        public ICollection<Cuenta> Cuentas { get; set; } = new List<Cuenta>();
    }
}