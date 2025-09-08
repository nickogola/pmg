using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnnouncementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Announcements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
        {
            return await _context.Announcements
                .Include(a => a.Property)
                .Include(a => a.Issuer)
                .Where(a => a.IsActive && (a.EndDate == null || a.EndDate >= DateTime.Today))
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Announcements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Announcement>> GetAnnouncement(int id)
        {
            var announcement = await _context.Announcements
                .Include(a => a.Property)
                .Include(a => a.Issuer)
                .FirstOrDefaultAsync(a => a.AnnouncementId == id);

            if (announcement == null)
            {
                return NotFound();
            }

            return announcement;
        }

        // GET: api/Announcements/ByProperty/5
        [HttpGet("ByProperty/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncementsByProperty(int propertyId)
        {
            return await _context.Announcements
                .Include(a => a.Issuer)
                .Where(a => a.PropertyId == propertyId && a.IsActive && (a.EndDate == null || a.EndDate >= DateTime.Today))
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Announcements/ForTenant/5
        [HttpGet("ForTenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncementsForTenant(int tenantId)
        {
            // Get properties where the tenant has active leases
            var tenantPropertyIds = await _context.Leases
                .Where(l => l.TenantId == tenantId && l.IsActive)
                .Select(l => l.Unit.PropertyId)
                .Distinct()
                .ToListAsync();

            return await _context.Announcements
                .Include(a => a.Property)
                .Include(a => a.Issuer)
                .Where(a => (a.PropertyId == null || tenantPropertyIds.Contains(a.PropertyId.Value)) && 
                           a.IsActive && 
                           (a.EndDate == null || a.EndDate >= DateTime.Today))
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // PUT: api/Announcements/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncement(int id, Announcement announcement)
        {
            if (id != announcement.AnnouncementId)
            {
                return BadRequest();
            }

            // Update timestamp
            announcement.UpdatedAt = DateTime.UtcNow;

            _context.Entry(announcement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnnouncementExists(id))
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

        // POST: api/Announcements
        [HttpPost]
        public async Task<ActionResult<Announcement>> PostAnnouncement(Announcement announcement)
        {
            // Set creation timestamp
            announcement.CreatedAt = DateTime.UtcNow;
            announcement.UpdatedAt = DateTime.UtcNow;
            announcement.PropertyId = 1;
            announcement.IssuedBy = 4;
            
            // Set default start date to today if not provided
            if (announcement.StartDate == DateTime.MinValue)
            {
                announcement.StartDate = DateTime.Today;
            }
            try
            {
                _context.Announcements.Add(announcement);
                await _context.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                Console.WriteLine(exp.Message);
              //  Log()
            }

            return CreatedAtAction("GetAnnouncement", new { id = announcement.AnnouncementId }, announcement);
        }

        // DELETE: api/Announcements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound();
            }

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnnouncementExists(int id)
        {
            return _context.Announcements.Any(e => e.AnnouncementId == id);
        }
    }
}
