import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ThemeToggle from '../Common/ThemeToggle';
import { useAuth } from '../Common/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Events', path: '/', icon: Calendar },
    ...(user ? [
      user.role === 'attendee' 
        ? { name: 'My Tickets', path: '/dashboard/bookings', icon: LayoutDashboard }
        : { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
    ] : []),
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--bg-primary)]/80 backdrop-blur-lg py-3 shadow-2xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-event-gold rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
            <Calendar className="text-black w-6 h-6 -rotate-12" />
          </div>
          <span className="text-xl font-bold tracking-tighter">
            RWANDA <span className="text-event-gold font-black">EVENTHUB</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-event-gold ${
                location.pathname === link.path ? 'text-event-gold' : 'dark:text-gray-300 text-slate-600'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="flex items-center space-x-4 border-l border-[var(--border-color)] pl-8">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-3 bg-white/5 border border-[var(--border-color)] px-4 py-1.5 rounded-xl">
                 <div className="w-8 h-8 bg-event-gold/20 rounded-lg flex items-center justify-center text-event-gold font-bold text-xs uppercase italic">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                 </div>
                 <div className="hidden lg:block">
                    <p className="text-xs font-bold leading-none">{user.name || user.username || 'User'}</p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase font-black tracking-widest mt-1">{user.role}</p>
                 </div>
              </div>
            ) : (
              <Link to="/login" className="glass-button flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button className="text-[var(--text-primary)]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-color)] p-6 flex flex-col space-y-4"
          >
            {user && (
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-[var(--border-color)] mb-4">
                 <div className="w-12 h-12 bg-event-gold/20 rounded-xl flex items-center justify-center text-event-gold font-bold text-lg italic">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                 </div>
                 <div>
                    <p className="font-bold">{user.name || user.username || 'User'}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest">{user.role}</p>
                 </div>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 text-lg font-medium"
              >
                <link.icon className="text-event-gold w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}

            {user ? (
               <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full mt-6 flex items-center justify-center space-x-2 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold border border-red-500/20"
               >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
               </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center py-4 mt-4"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
