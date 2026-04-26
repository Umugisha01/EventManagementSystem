import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />
      
      <div className="flex">
        {isDashboard && <Sidebar role="admin" />} {/* Fixed to admin for demo, can be dynamic */}
        
        <main className={`flex-1 transition-all duration-300 ${
          isDashboard ? 'lg:ml-64 pt-24 px-6 pb-12' : 'pt-0'
        }`}>
          {children}
        </main>
      </div>

      <footer className={`py-12 border-t border-[var(--border-color)] ${isDashboard ? 'lg:ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Rwanda EventHub. All Rights Reserved. Built for Rwandan Venues.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
