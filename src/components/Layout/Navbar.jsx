import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Events', path: '/', icon: Calendar },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const bgClass = scrolled 
    ? isDark 
      ? 'bg-event-charcoal/80 dark:bg-event-charcoal/80' 
      : 'bg-white/80 light:bg-white/80'
    : isDark
      ? 'bg-transparent'
      : 'light:bg-transparent';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgClass} backdrop-blur-lg py-3 ${scrolled ? 'shadow-2xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-event-gold rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
            <Calendar className="text-black w-6 h-6 -rotate-12" />
          </div>
          <span className={`text-xl font-bold tracking-tighter ${isDark ? 'text-white' : 'light:text-gray-900'}`}>
            RWANDA <span className="text-event-gold">EVENTHUB</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'text-event-gold' 
                  : isDark
                    ? 'text-gray-300 hover:text-event-gold'
                    : 'light:text-gray-600 light:hover:text-event-gold'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          ))}
          <Link to="/login" className="glass-button flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>

        <button className="md:hidden text-white dark:text-white light:text-gray-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute top-full left-0 w-full ${isDark ? 'bg-event-charcoal/95' : 'light:bg-white/95'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'light:border-black/10'} p-6 flex flex-col space-y-4`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 text-lg ${isDark ? 'text-white' : 'light:text-gray-900'}`}
              >
                <link.icon className="text-event-gold" />
                <span>{link.name}</span>
              </Link>
            ))}
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary text-center">
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
