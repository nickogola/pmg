using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Unit
    {
        [Key] 
        public int UnitId { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        
        [Required]
        [StringLength(20)]
        public string UnitNumber { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal MonthlyRent { get; set; }
        
        [Required]
        public int Bedrooms { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(3, 1)")]
        public decimal Bathrooms { get; set; }
        
        [Required]
        public int SquareFeet { get; set; }
        
        [Required]
        public bool IsOccupied { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PropertyId")]
        public Property? Property { get; set; }
        
        public ICollection<Lease>? Leases { get; set; }
        
        public ICollection<Ticket>? Tickets { get; set; }
    }
}
