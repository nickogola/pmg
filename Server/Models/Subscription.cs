using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Subscription
    {
        [Key]
        public string Id { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        [Required]
        public string PlanId { get; set; }
        
        [Required]
        public string PlanName { get; set; }
        
        [Required]
        public string Status { get; set; } // active, canceled, past_due, unpaid, etc.
        
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        public DateTime? TrialEndDate { get; set; }
        
        public DateTime CurrentPeriodStart { get; set; }
        
        public DateTime CurrentPeriodEnd { get; set; }
        
        public bool CancelAtPeriodEnd { get; set; }
        
        public decimal Amount { get; set; }
        
        public string Interval { get; set; } // month, year
        
        public string PaymentMethodId { get; set; }
        
        public string LastFourDigits { get; set; }

        // Navigation property
        public User User { get; set; }
    }

    public class SubscriptionPlan
    {
        public string Id { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public decimal Price { get; set; }
        
        public string BillingPeriod { get; set; }
        
        public List<string> Features { get; set; }
        
        public List<string> Limitations { get; set; }
        
        public bool IsRecommended { get; set; }
    }

    public class Invoice
    {
        [Key]
        public string Id { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        [Required]
        public string SubscriptionId { get; set; }
        
        public decimal Amount { get; set; }
        
        public string Status { get; set; }
        
        public DateTime Date { get; set; }
        
        public DateTime? PaidDate { get; set; }
        
        public string ReceiptUrl { get; set; }

        // Navigation property
        public User User { get; set; }
        public Subscription Subscription { get; set; }
    }
}
