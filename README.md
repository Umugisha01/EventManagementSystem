# 🇷🇼 Rwanda EventHub - Premium Event Management System

Rwanda EventHub is a state-of-the-art, full-stack event management platform designed to streamline the lifecycle of events in Rwanda. From interactive seat booking to real-time QR ticket verification, the system provides a seamless experience for administrators, managers, staff, and attendees.

## 🚀 System Overview

The system is split into a modern **React + Vite** frontend and a robust **ASP.NET Core** backend, integrated with **SQL Server** for persistent data management. It features a role-based access control (RBAC) system that tailors the interface to four distinct user types.

---

## 🎨 Key Features by Role

### 👤 Attendee (Public & Private)
- **Event Discovery**: Browse upcoming events with rich visuals and descriptions.
- **Interactive Booking**: High-end seat selection interface with real-time availability.
- **Mobile Ticketing**: Access digital tickets with unique QR codes for entry.
- **Payment Integration**: Simulated MTN MoMo payment flow for a realistic Rwandan checkout experience.

### 💼 Manager
- **Event Oversight**: Manage assigned events, track bookings, and monitor revenue.
- **Staff Assignment**: Delegate scanning tasks to staff members for specific events.
- **Real-time Analytics**: Detailed reports on event occupancy and performance.
- **Attendee Tracking**: View lists of booked attendees for logistical planning.

### 🛡️ Administrator
- **Platform Control**: Full management of users, roles, and system health.
- **Venue Management**: Create and configure venues with custom seat layouts (imported via Excel).
- **Event Orchestration**: Create new events and assign qualified managers.
- **Global Insights**: System-wide analytics overview.

### 📡 Staff (QR Scanner)
- **Tactical Scanner**: A mobile-optimized interface for rapid QR ticket verification.
- **Entry Validation**: Instant feedback on ticket validity to prevent double-entry.
- **Scanned Logs**: View a history of validated entries for the current session.

---

## 🛠️ Technology Stack

### Frontend (`.Net01`)
- **React 18**: Component-based UI architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first styling for a premium, responsive design.
- **Lucide React**: Beautiful, consistent iconography.
- **Axios**: Promised-based HTTP client for API communication.
- **React Router**: Client-side routing with role-based protection.

### Backend (`RwandaEventHub`)
- **ASP.NET Core 8.0**: High-performance web API framework.
- **Entity Framework Core**: ORM for SQL Server interaction.
- **Identity Framework**: Secure user authentication and role management.
- **JWT Authentication**: Token-based security for stateless API communication.
- **Swagger/OpenAPI**: Interactive API documentation and testing interface.
- **QRCoder**: Server-side QR code generation for secure ticketing.

---

## 🏗️ Architecture & Integration

- **CORS Configuration**: The backend is configured to securely allow requests from the Vite development server.
- **Database**: SQL Server hosting a schema optimized for high-concurrency booking and detailed analytics.
- **API First**: The system follows an API-first approach, ensuring the frontend and backend are loosely coupled.
- **Middleware**: Custom exception handling and response compression for performance and reliability.

---

## 🚦 Getting Started

### Backend
1. Navigate to the `RwandaEventHub` directory.
2. Update `appsettings.json` with your SQL Server connection string.
3. Run `dotnet ef database update` to apply migrations.
4. Run `dotnet run` to start the API (accessible at `/swagger`).

### Frontend
1. Navigate to the `.Net01` directory.
2. Run `npm install` to fetch dependencies.
3. Run `npm run dev` to start the development server.
4. Update `.env` (or `api.js`) with the backend API URL.

---

## 🌐 Live Status
The backend features a premium landing page that provides quick access to the Swagger documentation, indicating system health and database connectivity.
