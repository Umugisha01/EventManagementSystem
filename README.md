# Rwanda EventHub - Event Management Platform

A modern, full-featured event management and ticketing platform built for Rwanda's vibrant event ecosystem.

## 🎯 Project Overview

Rwanda EventHub is a comprehensive web application designed to streamline event management, venue booking, and ticket sales in Rwanda. The platform combines an intuitive attendee experience with powerful administrative tools for venue managers and event organizers.

**Live URL:** http://localhost:5174

## ✨ Key Features

### Public Features
- **Event Discovery**: Browse upcoming events with detailed descriptions
- **Seat-Based Booking**: Interactive seat map with real-time availability
- **MTN MoMo Payment Integration**: Secure payment processing for Rwandan users
- **Event Details**: Comprehensive event information with speaker profiles
- **User Authentication**: Login and registration system

### Admin Dashboard
- **System Overview**: Real-time analytics and KPIs (revenue, attendees, occupancy)
- **Venue Management**: Add and manage venue availability
- **Booking Management**: Track and manage all ticket orders
- **Speaker Management**: Manage event speakers and their profiles
- **User Access Control**: Manage team member permissions
- **Reports**: Generate system reports and analytics
- **Analytics Dashboard**: Revenue trends, attendance flows, venue utilization charts

### Theme Support
- **Dark Mode**: Default theme optimized for modern UI
- **Light Mode**: Professional light theme for daytime usage
- **Persistent Preference**: Theme selection saved to localStorage

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.4 with React Router v7
- **Styling**: Tailwind CSS 3.4.19 with custom glass-morphism components
- **Animations**: Framer Motion 12.38.0
- **Charts**: Chart.js with react-chartjs-2 integration
- **Icons**: Lucide React 1.8.0
- **Build Tool**: Vite 8.0.4

### Supporting Libraries
- **State Management**: Context API (ThemeContext)
- **Toast/Notifications**: Built-in alert system
- **Utilities**: clsx, tailwind-merge

## 📁 Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   └── Analytics.jsx          # Chart components for dashboard
│   ├── Booking/
│   │   ├── SeatMap.jsx            # Interactive seat selection
│   │   └── MomoPayment.jsx        # MTN MoMo payment flow
│   ├── Common/
│   │   └── EventCard.jsx          # Reusable event card component
│   └── Layout/
│       ├── MainLayout.jsx         # Root layout wrapper
│       ├── Navbar.jsx             # Top navigation
│       └── Sidebar.jsx            # Admin dashboard sidebar
├── context/
│   └── ThemeContext.jsx           # Dark/light mode context
├── data/
│   └── events.js                  # Mock event data
├── pages/
│   ├── Home.jsx                   # Homepage with hero & featured events
│   ├── Login.jsx                  # User login page
│   ├── Register.jsx               # User registration page
│   ├── EventDetails.jsx           # Event details & booking page
│   ├── Dashboard.jsx              # Dashboard router
│   ├── DashboardHome.jsx          # Admin overview page
│   ├── Venues.jsx                 # Venue management
│   ├── Bookings.jsx               # Booking management table
│   ├── Speakers.jsx               # Speaker management
│   ├── Users.jsx                  # User access control
│   ├── Reports.jsx                # Reports & analytics
│   ├── AnalyticsPage.jsx          # Detailed analytics
│   ├── Profile.jsx                # User profile settings
│   ├── Settings.jsx               # Theme & notification settings
│   └── NotFound.jsx               # 404 page
├── App.jsx                        # Main app router
├── main.jsx                       # React entry point
├── index.css                      # Global styles + theme definitions
└── App.css                        # Additional styles

public/                            # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Navigate to project directory
cd d:\Net01\.Net01

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5174`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Routes & Pages

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Homepage with featured events |
| `/login` | Login | User authentication |
| `/register` | Register | New user account creation |
| `/event/:id` | Event Details | Event details with seat booking |

### Admin Routes (Dashboard)
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Overview | System KPIs and analytics |
| `/dashboard/venues` | Venues | Manage venue availability |
| `/dashboard/bookings` | Bookings | View all ticket orders |
| `/dashboard/speakers` | Speakers | Manage event speakers |
| `/dashboard/users` | Users | Control team access |
| `/dashboard/reports` | Reports | Generate analytics reports |
| `/dashboard/analytics` | Analytics | Detailed performance charts |
| `/dashboard/profile` | Profile | User account settings |
| `/dashboard/settings` | Settings | Theme & notification preferences |

## 🎨 Design Features

### Color Palette
- **Primary Gold**: `#D4AF37` (Event accents & buttons)
- **VIP Gold**: `#FFD700` (Premium tier highlight)
- **Dark Background**: `#121212` (Main dark theme)
- **Charcoal**: `#1E1E1E` (Secondary dark)
- **Green**: `#10B981` (Regular seat tier)
- **Blue**: `#3B82F6` (General seat tier)

### Component Library
- **Glass Cards**: Frosted glass effect with blur
- **Primary Buttons**: Gold gradient with hover scale
- **Glass Buttons**: Subtle glass-morphism secondary actions
- **Responsive Layout**: Mobile-first design with Tailwind breakpoints
- **Smooth Animations**: Framer Motion transitions and micro-interactions

## 📊 Mock Data

The app includes realistic mock data for testing:

### Events (4 featured events)
1. Rwanda Tech Summit 2026 (May)
2. Visit Rwanda Tourism Gala (June)
3. Kigali Creative Expo (July)
4. Rwanda Sports & Wellness Fair (August)

### Seat Types
- **VIP**: 50,000 RWF (Row A only)
- **Regular**: 25,000 RWF (Rows B-C)
- **General**: 10,000 RWF (Rows D-F)

### Dashboard Data
- Sample venues, bookings, speakers, and users
- Mock analytics with revenue and attendance trends
- Chart visualizations with Chart.js

## 🌗 Dark/Light Mode

### Implementation
1. **ThemeContext**: Global theme state management
2. **localStorage**: Persistent user preference
3. **CSS Variables**: Dynamic color switching
4. **Tailwind Classes**: Conditional styling with `dark:` and `light:` prefixes

### Toggle Location
Settings page → Dashboard Settings → "Dark Mode" checkbox

## 🔐 Security & Payments

### Current State
- **Authentication**: UI forms prepared for backend integration
- **Payment Flow**: MTN MoMo simulated USSD flow
- **Data**: Mock data for development/testing

### Future Integration Points
- Backend authentication API
- MTN MoMo payment gateway
- Database for persistent data

## 📱 Responsive Design

The app is fully responsive across all devices:
- **Mobile**: Single column, hamburger menu
- **Tablet**: 2-column layouts, adapted sidebar
- **Desktop**: Full 3-column layouts, visible navigation

Breakpoints optimized for common device sizes (sm, md, lg, xl).

## 🎯 Custom Tailwind Classes

Global CSS utilities defined in `index.css`:

```css
.glass-card     /* Frosted glass card containers */
.glass-button   /* Glass-morphism secondary buttons */
.btn-primary    /* Gold primary action buttons */
.premium-gradient /* Gradient text effect */
.seat-grid      /* Flexible seat map grid */
```

## 🚦 Build Info

- **Last Build**: 2157 modules
- **CSS Bundle**: 31.60 kB (5.83 kB gzipped)
- **JS Bundle**: 614.40 kB (196.98 kB gzipped)
- **Build Time**: ~19 seconds (Vite optimized)

## 📝 Environment Setup

### Configuration Files
- `vite.config.js` - Vite build configuration with React plugin
- `tailwind.config.js` - Tailwind CSS with dark mode (class-based)
- `postcss.config.js` - PostCSS with autoprefixer
- `package.json` - Dependencies and build scripts
- `.eslintrc.js` - ESLint configuration

## 🔄 Development Workflow

1. **Start Dev Server**: `npm run dev`
2. **Make Changes**: Edit React components in `src/`
3. **Auto Reload**: Vite hot module replacement
4. **Build**: `npm run build` for production
5. **Preview**: `npm run preview` to test production build

## 📖 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎓 Implementation Highlights

### Pages Built
- ✅ **Home** - Hero section with featured events and info cards
- ✅ **Login** - Credential-based authentication UI
- ✅ **Register** - New user account creation form
- ✅ **Event Details** - Full event information with interactive seat map
- ✅ **Dashboard** - Admin hub with navigation routing
- ✅ **Venues** - Venue listing and management cards
- ✅ **Bookings** - Booking history and management table
- ✅ **Speakers** - Speaker profiles with team showcase
- ✅ **Users** - User access control table
- ✅ **Reports** - Analytics and reporting cards
- ✅ **Analytics** - Comprehensive charts and graphs
- ✅ **Profile** - User account settings
- ✅ **Settings** - Theme toggle and preferences
- ✅ **404** - Not found error page

### Components Created
- ✅ **EventCard** - Reusable event display component
- ✅ **SeatMap** - Interactive 6x10 seat selection grid
- ✅ **MomoPayment** - MTN MoMo payment flow simulator
- ✅ **Navbar** - Responsive top navigation with mobile menu
- ✅ **Sidebar** - Admin navigation with role-based menu items
- ✅ **MainLayout** - App wrapper with navbar, sidebar, footer
- ✅ **Analytics Charts** - Revenue, occupancy, and attendance charts

### Features Implemented
- ✅ Full routing with React Router v7
- ✅ Dark/light mode with localStorage persistence
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Interactive seat booking with price tiers
- ✅ Admin dashboard with statistics and charts
- ✅ Mock event data with 4 events
- ✅ Form inputs for login/register/profile
- ✅ Animated transitions with Framer Motion
- ✅ Glass-morphism design system
- ✅ Real-time theme switching

## 🔗 Key Libraries & Dependencies

```json
{
  "dependencies": {
    "chart.js": "^4.5.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.8.0",
    "react": "^19.2.4",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.1",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "tailwindcss": "^3.4.19",
    "vite": "^8.0.4"
  }
}
```

## 💻 Learning Resources

### Core Technologies
- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Vite Guide](https://vitejs.dev)
- [Chart.js](https://www.chartjs.org)

### Project Patterns
- Component-based architecture
- Context API for global state
- Responsive design with Tailwind
- Modern CSS techniques (grid, flexbox, animations)
- Custom React hooks and patterns

## 📜 Credits

**Project**: Rwanda EventHub - Event Management Platform  
**Created**: April 18, 2026  
**Technology**: React + Tailwind CSS + Vite  
**Status**: ✅ Complete Frontend Implementation

---

Built with ❤️ for Rwanda's event community
