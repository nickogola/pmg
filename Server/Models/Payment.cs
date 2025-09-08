using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Payment
    {
        [Key] 
        public int PaymentId { get; set; }
        
        [Required]
        public int LeaseId { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Amount { get; set; }
        
        [Required]
        public DateTime PaymentDate { get; set; }
        
        [Required]
        [StringLength(20)]
        public string PaymentType { get; set; } = string.Empty; // Rent, LateFee, Deposit, Other
        
        [Required]
        [StringLength(20)]
        public string PaymentMethod { get; set; } = string.Empty; // CreditCard, BankTransfer, Cash, Check
        
        [StringLength(100)]
        public string? TransactionId { get; set; }
        
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("LeaseId")]
        public Lease? Lease { get; set; }
    }
}
