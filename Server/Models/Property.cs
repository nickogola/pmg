using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Property
    {
        [Key] 
        public int PropertyId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string State { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string ZipCode { get; set; } = string.Empty;
        
        [Required]
        public int OwnerId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("OwnerId")]
        public User? Owner { get; set; }
        
        public ICollection<Unit>? Units { get; set; }
        
        public ICollection<Announcement>? Announcements { get; set; }
    }
}
