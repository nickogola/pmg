using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class TicketComment
    {
        [Key]
        public int CommentId { get; set; }
        
        [Required]
        public int TicketId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public string Comment { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("TicketId")]
        public Ticket? Ticket { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
