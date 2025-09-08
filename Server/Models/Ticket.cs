using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        
        [Required]
        public int UnitId { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = string.Empty; // Low, Medium, High, Emergency
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "New"; // New, Assigned, InProgress, OnHold, Resolved, Closed, Denied
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UnitId")]
        public Unit? Unit { get; set; }
        
        [ForeignKey("TenantId")]
        public User? Tenant { get; set; }
        
        public ICollection<TicketComment>? Comments { get; set; }
    }
}
