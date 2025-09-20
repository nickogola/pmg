using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Lease
    {
        [Key]
        public int LeaseId { get; set; }
        
        [Required]
        public int UnitId { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        [Column(TypeName = "date")]
        public DateTime StartDate { get; set; }
        
        [Required]
        [Column(TypeName = "date")]
        public DateTime EndDate { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal MonthlyRent { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal SecurityDeposit { get; set; }
        
        [Required]
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        //[ForeignKey("UnitId")]
        //public Unit? Unit { get; set; }
        
        //[ForeignKey("TenantId")]
        //public User? Tenant { get; set; }
        
        //public ICollection<Payment>? Payments { get; set; }
    }
}
