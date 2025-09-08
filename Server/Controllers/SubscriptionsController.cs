using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public SubscriptionsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/subscriptions/plans
        [HttpGet("plans")]
        public ActionResult<IEnumerable<SubscriptionPlan>> GetPlans()
        {
            var plans = new List<SubscriptionPlan>
            {
                new SubscriptionPlan
                {
                    Id = "free",
                    Name = "Free Plan",
                    Description = "Basic plan for small landlords",
                    Price = 0,
                    BillingPeriod = "month",
                    Features = new List<string>
                    {
                        "Add and manage tenants",
                        "Send messages and announcements",
                        "Basic property management"
                    },
                    Limitations = new List<string>
                    {
                        "No online rent payments",
                        "Limited to 5 units",
                        "Basic reporting"
                    }
                },
                new SubscriptionPlan
                {
                    Id = "premium-monthly",
                    Name = "Premium Plan",
                    Description = "Full-featured plan for serious property managers",
                    Price = 19.95m,
                    BillingPeriod = "month",
                    Features = new List<string>
                    {
                        "Everything in Free Plan",
                        "Collect rent online",
                        "Unlimited units",
                        "Advanced reporting and analytics",
                        "Maintenance request tracking",
                        "Document management",
                        "Priority support"
                    },
                    IsRecommended = true
                },
                new SubscriptionPlan
                {
                    Id = "premium-yearly",
                    Name = "Premium Plan (Annual)",
                    Description = "Save with our annual plan",
                    Price = 180m,
                    BillingPeriod = "year",
                    Features = new List<string>
                    {
                        "Everything in Monthly Premium Plan",
                        "Save $59.40 per year (25% discount)"
                    }
                }
            };

            return Ok(plans);
        }

        // GET: api/subscriptions/user/{userId}
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<Subscription>> GetUserSubscription(string userId)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "active");

            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        // POST: api/subscriptions
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SubscriptionResponse>> CreateSubscription(SubscriptionRequest request)
        {
            try
            {
                // For free plans, create the subscription directly
                if (request.PlanId == "free")
                {
                    var subscription = new Subscription
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = request.UserId,
                        PlanId = request.PlanId,
                        PlanName = request.PlanName,
                        Status = "active",
                        StartDate = DateTime.UtcNow,
                        CurrentPeriodStart = DateTime.UtcNow,
                        CurrentPeriodEnd = DateTime.UtcNow.AddYears(100), // Effectively unlimited for free plan
                        CancelAtPeriodEnd = false,
                        Amount = 0,
                        Interval = "month"
                    };

                    _context.Subscriptions.Add(subscription);
                    await _context.SaveChangesAsync();

                    return Ok(new SubscriptionResponse
                    {
                        SubscriptionId = subscription.Id,
                        Status = "success",
                        Message = "Free plan subscription activated"
                    });
                }
                else
                {
                    // For paid plans, this would integrate with a payment provider like Stripe
                    // For now, we'll simulate the process

                    // In a real implementation, you would create a checkout session with Stripe
                    // and return the checkout URL to redirect the user

                    var subscription = new Subscription
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = request.UserId,
                        PlanId = request.PlanId,
                        PlanName = request.PlanName,
                        Status = "pending", // Would be updated after successful payment
                        StartDate = DateTime.UtcNow,
                        CurrentPeriodStart = DateTime.UtcNow,
                        CurrentPeriodEnd = request.Interval == "month" 
                            ? DateTime.UtcNow.AddMonths(1) 
                            : DateTime.UtcNow.AddYears(1),
                        CancelAtPeriodEnd = false,
                        Amount = request.Amount,
                        Interval = request.Interval
                    };

                    _context.Subscriptions.Add(subscription);
                    await _context.SaveChangesAsync();

                    return Ok(new SubscriptionResponse
                    {
                        SubscriptionId = subscription.Id,
                        Status = "pending",
                        CheckoutUrl = $"/checkout/{subscription.Id}", // Simulate a checkout URL
                        Message = "Please complete the checkout process"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new SubscriptionResponse
                {
                    Status = "error",
                    Message = $"An error occurred: {ex.Message}"
                });
            }
        }

        // POST: api/subscriptions/{id}/cancel
        [HttpPost("{id}/cancel")]
        [Authorize]
        public async Task<ActionResult<SubscriptionResponse>> CancelSubscription(string id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);

            if (subscription == null)
            {
                return NotFound();
            }

            subscription.CancelAtPeriodEnd = true;
            await _context.SaveChangesAsync();

            return Ok(new SubscriptionResponse
            {
                SubscriptionId = subscription.Id,
                Status = "success",
                Message = "Subscription will be canceled at the end of the billing period"
            });
        }

        // POST: api/subscriptions/{id}/resume
        [HttpPost("{id}/resume")]
        [Authorize]
        public async Task<ActionResult<SubscriptionResponse>> ResumeSubscription(string id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);

            if (subscription == null)
            {
                return NotFound();
            }

            subscription.CancelAtPeriodEnd = false;
            await _context.SaveChangesAsync();

            return Ok(new SubscriptionResponse
            {
                SubscriptionId = subscription.Id,
                Status = "success",
                Message = "Subscription resumed successfully"
            });
        }

        // POST: api/subscriptions/{id}/change-plan
        [HttpPost("{id}/change-plan")]
        [Authorize]
        public async Task<ActionResult<SubscriptionResponse>> ChangePlan(string id, ChangePlanRequest request)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);

            if (subscription == null)
            {
                return NotFound();
            }

            // In a real implementation, this would handle prorations and plan changes through Stripe
            subscription.PlanId = request.NewPlanId;
            await _context.SaveChangesAsync();

            return Ok(new SubscriptionResponse
            {
                SubscriptionId = subscription.Id,
                Status = "success",
                Message = "Plan changed successfully"
            });
        }

        // GET: api/subscriptions/user/{userId}/invoices
        [HttpGet("user/{userId}/invoices")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices(string userId)
        {
            var invoices = await _context.Invoices
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.Date)
                .ToListAsync();

            return Ok(invoices);
        }

        // POST: api/subscriptions/webhook
        [HttpPost("webhook")]
        public async Task<ActionResult> HandleWebhook([FromBody] object webhookEvent)
        {
            // In a real implementation, this would validate and process webhook events from Stripe
            // For security, you would verify the webhook signature

            return Ok();
        }
    }

    // Request and response models
    public class SubscriptionRequest
    {
        public string UserId { get; set; }
        public string PlanId { get; set; }
        public string PlanName { get; set; }
        public decimal Amount { get; set; }
        public string Interval { get; set; }
    }

    public class SubscriptionResponse
    {
        public string SubscriptionId { get; set; }
        public string Status { get; set; }
        public string CheckoutUrl { get; set; }
        public string Message { get; set; }
    }

    public class ChangePlanRequest
    {
        public string NewPlanId { get; set; }
    }
}
