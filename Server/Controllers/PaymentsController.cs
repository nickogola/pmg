using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Stripe;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IConfiguration _configuration;

        public PaymentsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments
                .Include(p => p.Lease)
                   // .ThenInclude(l => l.Tenant)
                .Include(p => p.Lease)
                   // .ThenInclude(l => l.Unit)
                      //  .ThenInclude(u => u.Property)
                .ToListAsync();
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Lease)
                    //.ThenInclude(l => l.Tenant)
                .Include(p => p.Lease)
                    //.ThenInclude(l => l.Unit)
                        //.ThenInclude(u => u.Property)
                .FirstOrDefaultAsync(p => p.PaymentId == id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // GET: api/Payments/ByTenant/5
        [HttpGet("ByTenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPaymentsByTenant(int tenantId)
        {
            return await _context.Payments
                .Include(p => p.Lease)
                   // .ThenInclude(l => l.Tenant)
                .Include(p => p.Lease)
                    //.ThenInclude(l => l.Unit)
                      //  .ThenInclude(u => u.Property)
                .Where(p => p.Lease.TenantId == tenantId)
                .ToListAsync();
        }

        // GET: api/Payments/ByProperty/5
        [HttpGet("ByProperty/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPaymentsByProperty(int propertyId)
        {
            return await _context.Payments
                .Include(p => p.Lease)
                   // .ThenInclude(l => l.Tenant)
                .Include(p => p.Lease)
                    //.ThenInclude(l => l.Unit)
                     //   .ThenInclude(u => u.Property)
               // .Where(p => p.Lease.Unit.PropertyId == propertyId)
                .ToListAsync();
        }

        //
        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"]; // Get from appsettings.json

            var options = new PaymentIntentCreateOptions
            {
                Amount = request.Amount,
                Currency = request.Currency,
                // Add other options like automatic_payment_methods
            };
            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return Ok(new { clientSecret = paymentIntent.ClientSecret });
        }

        // PUT: api/Payments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        // POST: api/Payments
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            // Set creation timestamp
            payment.CreatedAt = DateTime.UtcNow;
            payment.PaymentDate = DateTime.UtcNow;

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.PaymentId }, payment);
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.PaymentId == id);
        }
    }
}
