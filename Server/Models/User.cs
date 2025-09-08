using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class User
    {
        [Key] 
        public int UserId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [Required]
        [StringLength(128)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [StringLength(128)]
        public string Salt { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string UserType { get; set; } = string.Empty; // Tenant, Landlord, Admin
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Property>? OwnedProperties { get; set; }
        public ICollection<Lease>? Leases { get; set; }
        public ICollection<Ticket>? Tickets { get; set; }
        public ICollection<Announcement>? IssuedAnnouncements { get; set; }
        public ICollection<TicketComment>? TicketComments { get; set; }
    }
}
