using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Leases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lease>>> GetLeases()
        {
            return await _context.Leases
               // .Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
              //  .Include(l => l.Tenant)
                .ToListAsync();
        }

        // GET: api/Leases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lease>> GetLease(int id)
        {
            var lease = await _context.Leases
                //.Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
               // .Include(l => l.Tenant)
              //  .Include(l => l.Payments)
                .FirstOrDefaultAsync(l => l.LeaseId == id);

            if (lease == null)
            {
                return NotFound();
            }

            return lease;
        }

        // GET: api/Leases/ByTenant/5
        [HttpGet("ByTenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<Lease>>> GetLeasesByTenant(int tenantId)
        {
            return await _context.Leases
                //.Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
                //.Include(l => l.Tenant)
                .Where(l => l.TenantId == tenantId)
                .ToListAsync();
        }

        // GET: api/Leases/ByUnit/5
        [HttpGet("ByUnit/{unitId}")]
        public async Task<ActionResult<IEnumerable<Lease>>> GetLeasesByUnit(int unitId)
        {
            return await _context.Leases
                //.Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
                //.Include(l => l.Tenant)
                .Where(l => l.UnitId == unitId)
                .ToListAsync();
        }

        // GET: api/Leases/ByProperty/5
        [HttpGet("ByProperty/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Lease>>> GetLeasesByProperty(int propertyId)
        {
            return await _context.Leases
                //.Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
                //.Include(l => l.Tenant)
                //.Where(l => l.Unit.PropertyId == propertyId)
                .ToListAsync();
        }

        // GET: api/Leases/Active
        [HttpGet("Active")]
        public async Task<ActionResult<IEnumerable<Lease>>> GetActiveLeases()
        {
            return await _context.Leases
                //.Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
                //.Include(l => l.Tenant)
                .Where(l => l.IsActive && l.EndDate >= DateTime.Today)
                .ToListAsync();
        }

        // PUT: api/Leases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLease(int id, Lease lease)
        {
            if (id != lease.LeaseId)
            {
                return BadRequest();
            }

            lease.UpdatedAt = DateTime.UtcNow;
            _context.Entry(lease).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaseExists(id))
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

        // POST: api/Leases
        [HttpPost]
        public async Task<ActionResult<Lease>> PostLease(Lease lease)
        {
            // Set timestamps
            lease.CreatedAt = DateTime.UtcNow;
            lease.UpdatedAt = DateTime.UtcNow;
            
            // Validate that there are no overlapping active leases for the unit
            bool overlappingLeaseExists = await _context.Leases
                .AnyAsync(l => l.UnitId == lease.UnitId 
                           && l.IsActive 
                           && l.LeaseId != lease.LeaseId 
                           && ((lease.StartDate >= l.StartDate && lease.StartDate <= l.EndDate) ||
                               (lease.EndDate >= l.StartDate && lease.EndDate <= l.EndDate) ||
                               (lease.StartDate <= l.StartDate && lease.EndDate >= l.EndDate)));

            if (overlappingLeaseExists)
            {
                return BadRequest("An active lease already exists for this unit during the specified period.");
            }

            _context.Leases.Add(lease);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLease", new { id = lease.LeaseId }, lease);
        }

        // PATCH: api/Leases/5/terminate
        [HttpPatch("{id}/terminate")]
        public async Task<IActionResult> TerminateLease(int id)
        {
            var lease = await _context.Leases.FindAsync(id);
            
            if (lease == null)
            {
                return NotFound();
            }

            lease.IsActive = false;
            lease.UpdatedAt = DateTime.UtcNow;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaseExists(id))
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

        // PATCH: api/Leases/5/renew
        [HttpPatch("{id}/renew")]
        public async Task<ActionResult<Lease>> RenewLease(int id, [FromBody] LeaseRenewalRequest renewalRequest)
        {
            var existingLease = await _context.Leases.FindAsync(id);
            
            if (existingLease == null)
            {
                return NotFound();
            }

            // Create a new lease based on the existing one
            var newLease = new Lease
            {
                UnitId = existingLease.UnitId,
                TenantId = existingLease.TenantId,
                StartDate = renewalRequest.StartDate,
                EndDate = renewalRequest.EndDate,
                MonthlyRent = renewalRequest.MonthlyRent ?? existingLease.MonthlyRent,
                SecurityDeposit = renewalRequest.SecurityDeposit ?? existingLease.SecurityDeposit,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Validate that there are no overlapping active leases
            bool overlappingLeaseExists = await _context.Leases
                .AnyAsync(l => l.UnitId == newLease.UnitId 
                           && l.IsActive 
                           && l.LeaseId != id
                           && ((newLease.StartDate >= l.StartDate && newLease.StartDate <= l.EndDate) ||
                               (newLease.EndDate >= l.StartDate && newLease.EndDate <= l.EndDate) ||
                               (newLease.StartDate <= l.StartDate && newLease.EndDate >= l.EndDate)));

            if (overlappingLeaseExists)
            {
                return BadRequest("An active lease already exists for this unit during the specified period.");
            }

            // Mark the old lease as inactive
            existingLease.IsActive = false;
            existingLease.UpdatedAt = DateTime.UtcNow;

            // Add the new lease
            _context.Leases.Add(newLease);
            
            await _context.SaveChangesAsync();

            // Fetch the newly created lease with includes
            var createdLease = await _context.Leases
                //.Include(l => l.Unit)
                //    .ThenInclude(u => u.Property)
                //.Include(l => l.Tenant)
                .FirstOrDefaultAsync(l => l.LeaseId == newLease.LeaseId);

            return CreatedAtAction("GetLease", new { id = createdLease.LeaseId }, createdLease);
        }

        // DELETE: api/Leases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLease(int id)
        {
            var lease = await _context.Leases.FindAsync(id);
            if (lease == null)
            {
                return NotFound();
            }

            _context.Leases.Remove(lease);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaseExists(int id)
        {
            return _context.Leases.Any(e => e.LeaseId == id);
        }
    }

    public class LeaseRenewalRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal? MonthlyRent { get; set; }
        public decimal? SecurityDeposit { get; set; }
    }
}