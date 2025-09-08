using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Lease> Leases { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketComment> TicketComments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>()
                .HasMany(u => u.OwnedProperties)
                .WithOne(p => p.Owner)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Leases)
                .WithOne(l => l.Tenant)
                .HasForeignKey(l => l.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Tickets)
                .WithOne(t => t.Tenant)
                .HasForeignKey(t => t.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.IssuedAnnouncements)
                .WithOne(a => a.Issuer)
                .HasForeignKey(a => a.IssuedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.TicketComments)
                .WithOne(tc => tc.User)
                .HasForeignKey(tc => tc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Property entity
            modelBuilder.Entity<Property>()
                .HasMany(p => p.Units)
                .WithOne(u => u.Property)
                .HasForeignKey(u => u.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Property>()
                .HasMany(p => p.Announcements)
                .WithOne(a => a.Property)
                .HasForeignKey(a => a.PropertyId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Unit entity
            modelBuilder.Entity<Unit>()
                .HasMany(u => u.Leases)
                .WithOne(l => l.Unit)
                .HasForeignKey(l => l.UnitId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Unit>()
                .HasMany(u => u.Tickets)
                .WithOne(t => t.Unit)
                .HasForeignKey(t => t.UnitId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Lease entity
            modelBuilder.Entity<Lease>()
                .HasMany(l => l.Payments)
                .WithOne(p => p.Lease)
                .HasForeignKey(p => p.LeaseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Ticket entity
            modelBuilder.Entity<Ticket>()
                .HasMany(t => t.Comments)
                .WithOne(tc => tc.Ticket)
                .HasForeignKey(tc => tc.TicketId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Configure Subscription entity
            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Configure Invoice entity
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.User)
                .WithMany(u => u.Invoices)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Subscription)
                .WithMany()
                .HasForeignKey(i => i.SubscriptionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
