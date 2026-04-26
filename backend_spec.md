# Backend Specification - Rwanda EventHub (C# / .NET)

This document outlines the required backend structure, database schema, and API logic to support the Rwanda EventHub frontend.

## 1. System Overview
A robust Event Management System built with ASP.NET Core, focusing on interactive seat booking, role-based management, and integrated Rwandan payment solutions (MTN MoMo).

## 2. Database Schema (SQL Server)

### Users & Authentication (Identity)
| Table | Key Features / Columns |
|-------|--------------------------|
| **Users** | Id, FullName, Email, Role (Admin, Manager, Staff, Attendee), Username, PasswordHash |
| **UserRoles** | Identity join table |

### Venue Management
| Table | Columns | Details |
|-------|---------|---------|
| **Venues** | Id, Name, Address, Capacity, Type, LayoutJson | LayoutJson stores coordinates for the interactive map |
| **Seats** | Id, VenueId, SeatNumber, Row, Class (VVIP, VIP, Regular, General), Status | Linked to specific venues |

### Event Management
| Table | Columns | Details |
|-------|---------|---------|
| **Events** | Id, Title, Category, VenueId, ManagerId, StartDate, EndDate, ImageUrl, Description, Status | Status: Draft, Published, Completed |
| **EventPricing** | Id, EventId, SeatClass (VVIP...), Price (RWF), TotalCapacity | Specific pricing per event |

### Booking & Payments
| Table | Columns | Details |
|-------|---------|---------|
| **Bookings** | Id, EventId, UserId, SeatId, PaymentStatus, TotalPrice, BookingDate, QRTicketCode |
| **Payments** | Id, BookingId, TransactionRef, Method (MoMo), Status, Amount | MTN MoMo reference storage |

### Engagement
| Table | Columns | Details |
|-------|---------|---------|
| **Speakers** | Id, Name, Bio, PhotoUrl, Expertise |
| **EventSpeakers** | EventId, SpeakerId | Many-to-many relationship |

---

## 3. API Controllers & Logic

### AuthController
- `POST /api/auth/register`: Handle attendee registration.
- `POST /api/auth/login`: Issue JWT with role claims.
- `POST /api/auth/reset-password`: One-time password reset for assigned staff.

### EventsController
- `GET /api/events`: Paginated list of published events.
- `GET /api/events/{id}`: Detailed info including pricing and remaining seats.
- `POST /api/events`: (Admin only) Create new event with image upload logic.
- `POST /api/events/{id}/assign-manager`: (Admin only) Assign manager to event.

### VenuesController
- `GET /api/venues`: List of available locations.
- `POST /api/venues`: Create venue.
- `POST /api/venues/{id}/import-seats`: Handle Excel upload (.xlsx) and generate Seat records.

### BookingsController
- `POST /api/bookings/reserve`: Temporary seat lock (expire in 10 mins).
- `POST /api/bookings/checkout`: Initiate MTN MoMo simulation.
- `GET /api/bookings/my-tickets`: Retrieve digital tickets with QR codes.

### AnalyticsController
- `GET /api/analytics/manager/{managerId}`: Stats for assigned events (Revenue, occupancy).
- `GET /api/analytics/admin/overview`: Global system metrics.

---

## 4. Key Backend Features

### A. MTN MoMo Integration (Simulation)
```csharp
public class MomoService {
    public async Task<bool> ProcessPayment(string phone, decimal amount) {
        // Send push request to phone
        // Simulate waiting for user PIN
        // Return success/fail based on mock rules (e.g. phone starting with '078' = success)
    }
}
```

### B. Seat Map Import (Excel Logic)
- Use libraries like `ClosedXML` or `EPPlus`.
- Parse columns: `SeatNumber`, `Row`, `Class`.
- Bulk insert into `Seats` table for the specific `VenueId`.

### C. QR Ticket Generation
- Use `QRCoder` library in .NET.
- Payload: `BookingId`, `EventId`, `SeatId`, `VerificationToken`.
- Store QR as Base64 or Image path.

### D. Verification Logic (QR Scanning)
- `POST /api/verify/ticket`: Used by Staff on the scanner page.
- Check if ticket exists and matches the `EventId` assigned to the scanner.
- Mark ticket as `Used` to prevent double entry.
