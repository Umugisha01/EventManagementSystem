using RwandaEventHub.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace RwandaEventHub.Data;

public class AppDbContext : IdentityDbContext<User, Microsoft.AspNetCore.Identity.IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventPricing> EventPricings => Set<EventPricing>();
    public DbSet<StaffAssignment> StaffAssignments => Set<StaffAssignment>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<CheckInLog> CheckInLogs => Set<CheckInLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Users Uniques & Checks
        builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        builder.Entity<User>().HasIndex(u => u.UserName).IsUnique();
        // Role check handled by constants in code but can be enforced by CHECK constraint in SQL

        // Venues
        builder.Entity<Venue>()
            .ToTable(b => b.HasCheckConstraint("CK_Venue_Capacity", "Capacity >= 0"))
            .ToTable(b => b.HasCheckConstraint("CK_Venue_Type", "Type IN ('Physical', 'Virtual')"));

        // Seats
        builder.Entity<Seat>()
            .HasIndex(s => new { s.VenueId, s.Row, s.SeatNumber }).IsUnique();
        builder.Entity<Seat>()
            .ToTable(b => b.HasCheckConstraint("CK_Seat_Status", "Status IN ('Available', 'Reserved', 'Booked')"));
        builder.Entity<Seat>()
            .HasOne(s => s.Venue)
            .WithMany(v => v.Seats)
            .HasForeignKey(s => s.VenueId)
            .OnDelete(DeleteBehavior.Cascade);

        // Events
        builder.Entity<Event>()
            .ToTable(b => b.HasCheckConstraint("CK_Event_Dates", "EndDate > StartDate"))
            .ToTable(b => b.HasCheckConstraint("CK_Event_Status", "Status IN ('Draft', 'Published', 'Completed', 'Cancelled')"));
        builder.Entity<Event>()
            .HasOne(e => e.Manager)
            .WithMany()
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.SetNull);

        // EventPricing
        builder.Entity<EventPricing>()
            .HasIndex(ep => new { ep.EventId, ep.SeatClass }).IsUnique();
        builder.Entity<EventPricing>()
            .ToTable(b => b.HasCheckConstraint("CK_EventPricing_Price", "Price >= 0"))
            .ToTable(b => b.HasCheckConstraint("CK_EventPricing_Capacity", "TotalCapacity > 0"));

        // StaffAssignments
        builder.Entity<StaffAssignment>()
            .HasIndex(sa => new { sa.StaffId, sa.EventId }).IsUnique();

        // Bookings
        builder.Entity<Booking>()
            .ToTable(b => b.HasCheckConstraint("CK_Booking_PaymentStatus", "PaymentStatus IN ('Pending', 'Success', 'Failed')"))
            .ToTable(b => b.HasCheckConstraint("CK_Booking_Status", "BookingStatus IN ('Reserved', 'Confirmed', 'CheckedIn', 'Expired', 'Cancelled')"));

        // Payments
        builder.Entity<Payment>()
            .HasIndex(p => p.BookingId).IsUnique();
        builder.Entity<Payment>()
            .ToTable(b => b.HasCheckConstraint("CK_Payment_Phone", "Phone LIKE '078%' OR Phone LIKE '079%'"))
            .ToTable(b => b.HasCheckConstraint("CK_Payment_Amount", "Amount > 0"));

        // CheckInLogs
        builder.Entity<CheckInLog>()
            .ToTable(b => b.HasCheckConstraint("CK_CheckInLog_Result", "Result IN ('Valid', 'AlreadyScanned', 'WrongEvent', 'InvalidTicket')"));

        // Cascade/Cycle Protection
        builder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Booking>()
            .HasOne(b => b.Event)
            .WithMany(e => e.Bookings)
            .HasForeignKey(b => b.EventId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Booking>()
            .HasOne(b => b.Seat)
            .WithMany()
            .HasForeignKey(b => b.SeatId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<StaffAssignment>()
            .HasOne(sa => sa.Staff)
            .WithMany()
            .HasForeignKey(sa => sa.StaffId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<StaffAssignment>()
            .HasOne(sa => sa.Event)
            .WithMany(e => e.StaffAssignments)
            .HasForeignKey(sa => sa.EventId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<CheckInLog>()
            .HasOne(l => l.Booking)
            .WithMany()
            .HasForeignKey(l => l.BookingId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<CheckInLog>()
            .HasOne(l => l.Event)
            .WithMany()
            .HasForeignKey(l => l.EventId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
