namespace RwandaEventHub.Constants;

public static class AppConstants
{
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Manager = "Manager";
        public const string Staff = "Staff";
        public const string Attendee = "Attendee";
    }

    public static class VenueType
    {
        public const string Physical = "Physical";
        public const string Virtual = "Virtual";
    }

    public static class SeatStatus
    {
        public const string Available = "Available";
        public const string Reserved = "Reserved";
        public const string Booked = "Booked";
    }

    public static class EventStatus
    {
        public const string Draft = "Draft";
        public const string Published = "Published";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";
    }

    public static class PaymentStatus
    {
        public const string Pending = "Pending";
        public const string Success = "Success";
        public const string Failed = "Failed";
    }

    public static class BookingStatus
    {
        public const string Reserved = "Reserved";
        public const string Confirmed = "Confirmed";
        public const string CheckedIn = "CheckedIn";
        public const string Expired = "Expired";
        public const string Cancelled = "Cancelled";
    }

    public static class CheckInResult
    {
        public const string Valid = "Valid";
        public const string AlreadyScanned = "AlreadyScanned";
        public const string WrongEvent = "WrongEvent";
        public const string InvalidTicket = "InvalidTicket";
    }
}
