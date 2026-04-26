import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';

import { AuthProvider } from './components/Common/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import VenueManager from './pages/Admin/VenueManager';
import UserManagement from './pages/Admin/UserManagement';
import EventsList from './pages/Admin/EventsList';
import EventManager from './pages/Manager/EventManager';
import QRScanner from './pages/Manager/QRScanner';
import StaffManagement from './pages/Manager/StaffManagement';
import EventAttendees from './pages/Manager/EventAttendees';
import ScannedAttendees from './pages/Manager/ScannedAttendees';
import MyEvents from './pages/Manager/MyEvents';
import Bookings from './pages/Attendee/Bookings';
import BookingFlow from './pages/Attendee/BookingFlow';
import EventReport from './pages/Manager/EventReport';
import Chat from './pages/Common/Chat';
import { ThemeProvider } from './components/Common/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/book/:id" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/dashboard/venues" element={<ProtectedRoute allowedRoles={['admin']}><VenueManager /></ProtectedRoute>} />
            <Route path="/dashboard/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/dashboard/events" element={<ProtectedRoute allowedRoles={['admin']}><EventsList /></ProtectedRoute>} />
            
            {/* Manager Routes */}
            <Route path="/dashboard/my-events" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><MyEvents /></ProtectedRoute>} />
            <Route path="/dashboard/events/new" element={<ProtectedRoute allowedRoles={['admin']}><EventManager /></ProtectedRoute>} />
            <Route path="/dashboard/staff" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><StaffManagement /></ProtectedRoute>} />
            <Route path="/dashboard/attendees" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><EventAttendees /></ProtectedRoute>} />
            <Route path="/dashboard/events/report/:id" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><EventReport /></ProtectedRoute>} />
            
            {/* Staff Routes */}
            <Route path="/dashboard/scanner" element={<ProtectedRoute allowedRoles={['staff']}><QRScanner /></ProtectedRoute>} />
            <Route path="/dashboard/scanned" element={<ProtectedRoute allowedRoles={['staff']}><ScannedAttendees /></ProtectedRoute>} />
            
            {/* Common/Attendee Routes */}
            <Route path="/dashboard/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            <Route path="/dashboard/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
