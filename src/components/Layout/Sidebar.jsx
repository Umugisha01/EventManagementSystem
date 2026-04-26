import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Common/AuthContext';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  MessageSquare,
  ShieldCheck,
  ScanLine,
  LogOut,
  History
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || 'attendee';

  const menuItems = {
    admin: [
      { name: 'System Overview', icon: Home, path: '/dashboard' },
      { name: 'Events', icon: Calendar, path: '/dashboard/events' },
      { name: 'User Management', icon: ShieldCheck, path: '/dashboard/users' },
      { name: 'Venue Manager', icon: MapPin, path: '/dashboard/venues' },
      { name: 'Master Chat', icon: MessageSquare, path: '/dashboard/chat' },
    ],
    manager: [
      { name: 'My Events', icon: Calendar, path: '/dashboard/my-events' },
      { name: 'Event Attendees', icon: Users, path: '/dashboard/attendees' },
      { name: 'Staff Management', icon: ShieldCheck, path: '/dashboard/staff' },
    ],
    staff: [
      { name: 'QR Scanner', icon: ScanLine, path: '/dashboard/scanner' },
      { name: 'Scanned Logs', icon: History, path: '/dashboard/scanned' },
    ],
    attendee: [
      { name: 'My Tickets', icon: CreditCard, path: '/dashboard/bookings' },
      { name: 'Ask Admin', icon: MessageSquare, path: '/dashboard/chat' },
    ]
  };

  const lowerRole = role?.toLowerCase() || 'attendee';
  const navItems = menuItems[lowerRole] || menuItems['attendee'] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[var(--bg-primary)] border-r border-[var(--border-color)] pt-24 px-4">
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-event-gold text-black font-semibold shadow-lg shadow-event-gold/20' 
                : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="mt-auto mb-8 px-4 space-y-4">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Current Role</p>
          <p className="text-sm font-bold text-event-gold capitalize">{role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
