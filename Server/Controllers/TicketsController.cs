using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
        {
            return await _context.Tickets
                .Include(t => t.Unit)
                    .ThenInclude(u => u.Property)
                //.Include(t => t.Tenant)
                .ToListAsync();
        }

        // GET: api/Tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Unit!)
                    .ThenInclude(u => u.Property!)
               // .Include(t => t.Tenant!)
                .Include(t => t.Comments!)
                    .ThenInclude((TicketComment c) => c.User)
                .FirstOrDefaultAsync(t => t.TicketId == id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        // GET: api/Tickets/ByTenant/5
        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTicketsByTenant(int tenantId)
        {
            return await _context.Tickets
                .Include(t => t.Unit)
                    .ThenInclude(u => u.Property)
                .Where(t => t.TenantId == tenantId)
                .ToListAsync();
        }

        // GET: api/Tickets/ByProperty/5
        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTicketsByProperty(int propertyId)
        {
            return await _context.Tickets
                .Include(t => t.Unit)
                    .ThenInclude(u => u.Property)
                //.Include(t => t.Tenant)
                .Where(t => t.Unit.PropertyId == propertyId)
                .ToListAsync();
        }

        // PUT: api/Tickets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(int id, Ticket ticket)
        {
            if (id != ticket.TicketId)
            {
                return BadRequest();
            }

            // Update timestamp
            ticket.UpdatedAt = DateTime.UtcNow;

            _context.Entry(ticket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tickets
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(Ticket ticket)
        {
            // Set creation timestamp
            try
            {
                ticket.CreatedAt = DateTime.UtcNow;
                ticket.UpdatedAt = DateTime.UtcNow;
                ticket.UnitId = 1;
                ticket.TenantId = ticket.TenantId == 0 ? 8 : ticket.TenantId;

                // Set default status
                if (string.IsNullOrEmpty(ticket.Status))
                {
                    ticket.Status = "New";
                }

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception (optional: use a logger)
                return StatusCode(500, $"An error occurred while creating the ticket: {ex.Message}");
            }

            return CreatedAtAction("GetTicket", new { id = ticket.TicketId }, ticket);
        }

        // POST: api/Tickets/5/Comment
        [HttpPost("{ticketId}/Comment")]
        public async Task<ActionResult<TicketComment>> PostTicketComment(int ticketId, TicketComment comment)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);

            if (ticket == null)
            {
                return NotFound();
            }

            comment.TicketId = ticketId;
            comment.CreatedAt = DateTime.UtcNow;

            _context.TicketComments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTicket", new { id = ticketId }, comment);
        }

        // PUT: api/Tickets/5/Status
        [HttpPut("{id}/Status")]
        public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] string status)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Status = status;
            ticket.UpdatedAt = DateTime.UtcNow;

            _context.Entry(ticket).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TicketExists(int id)
        {
            return _context.Tickets.Any(e => e.TicketId == id);
        }
    }
}
