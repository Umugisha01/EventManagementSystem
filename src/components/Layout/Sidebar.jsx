import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ role = 'admin' }) => {
  const { isDark } = useTheme();

  const menuItems = {
    admin: [
      { name: 'Overview', icon: Home, path: '/dashboard' },
      { name: 'Venues', icon: MapPin, path: '/dashboard/venues' },
      { name: 'Bookings', icon: CreditCard, path: '/dashboard/bookings' },
      { name: 'Speakers', icon: Users, path: '/dashboard/speakers' },
      { name: 'User Access', icon: ShieldCheck, path: '/dashboard/users' },
      { name: 'Reports', icon: BarChart3, path: '/dashboard/reports' },
      { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
      { name: 'Profile', icon: Users, path: '/dashboard/profile' },
      { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ],
    manager: [
      { name: 'My Events', icon: Calendar, path: '/dashboard' },
      { name: 'Speakers', icon: Users, path: '/dashboard/speakers' },
      { name: 'Bookings', icon: CreditCard, path: '/dashboard/bookings' },
      { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    ],
    attendee: [
      { name: 'My Tickets', icon: CreditCard, path: '/dashboard' },
      { name: 'Profile', icon: Users, path: '/dashboard/profile' },
      { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ]
  };

  const navItems = menuItems[role] || menuItems.attendee;

  return (
    <aside className={`hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 ${isDark ? 'bg-event-charcoal border-r border-white/5' : 'light:bg-white light:border-r light:border-black/10'} pt-24 px-4`}>
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
                : isDark
                  ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                  : 'light:text-gray-600 light:hover:bg-black/5 light:hover:text-gray-900'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="mt-auto mb-8 px-4">
        <div className={`p-4 rounded-2xl ${isDark ? 'bg-gradient-to-br from-white/5 to-transparent border border-white/10' : 'light:bg-gradient-to-br light:from-black/5 light:to-transparent light:border light:border-black/10'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'light:text-gray-600'} mb-1`}>Current Role</p>
          <p className="text-sm font-bold text-event-gold capitalize">{role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
