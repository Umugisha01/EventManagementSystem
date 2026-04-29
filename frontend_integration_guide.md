# Frontend Integration Guide: RwandaEventHub API

This document provides all necessary details to connect your frontend application (React, Mobile, etc.) to the RwandaEventHub backend.

## 🚀 Connection Details
- **Base URL**: `http://localhost:5202`
- **Dashboard & Docs**: `http://localhost:5202/`
- **Swagger UI**: `http://localhost:5202/swagger`
- **OpenAPI JSON**: `http://localhost:5202/swagger/v1/swagger.json`

## 🔐 Authentication
The system uses **JWT (JSON Web Tokens)** for security.
1.  **Login**: `POST /api/Auth/login`
2.  **Usage**: Include the token in the headers of all protected requests:
    ```
    Authorization: Bearer <your_token>
    ```

## 📡 Primary Endpoints

### 1. Events
- `GET /api/Events` - List all published events.
- `GET /api/Events/{id}` - Details for a specific event.
- `POST /api/Events` - Create new event (Admin/Manager only).

### 2. Bookings & Payments
- `POST /api/Bookings` - Reserve a seat (starts 10-minute timer).
- `GET /api/Bookings/user/{userId}` - View user history.
- `POST /api/Momo/request` - Initiate MoMo payment simulation.

### 3. Venue Management
- `GET /api/Venues` - List all venues.
- `GET /api/Venues/{id}` - Includes seat layout JSON.

### 4. Admin & Staff
- `GET /api/Analytics/platform` - Platform-wide stats.
- `POST /api/Verify/ticket` - Staff QR scanner endpoint (locks staff to event).

## 🛠 Business Rules to Note
- **Booking Expiration**: Reservations expire after **10 minutes** if unpaid.
- **MoMo Format**: Phone numbers must be **10 digits** starting with `078` or `079`.
- **Concurrency**: Seat numbering is unique per venue. You cannot book an already reserved/booked seat.
- **Role Hierarchy**: 
    - `Admin`: Full control.
    - `Manager`: Manage assigned events/staff.
    - `Staff`: Scanner access only for assigned event.
    - `Attendee`: Booking and profile access.

## 📦 API Response Format
All responses follow a standardized JSON structure:
```json
{
  "success": true,
  "message": "Success notification message",
  "data": { ... },
  "errors": [],
  "statusCode": 200
}
```

## 🧪 Quick Test (cURL)
```bash
curl -X GET http://localhost:5202/api/Analytics/platform
```
