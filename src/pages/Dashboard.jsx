import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import Venues from './Venues';
import Users from './Users';
import Reports from './Reports';
import Bookings from './Bookings';
import Speakers from './Speakers';
import AnalyticsPage from './AnalyticsPage';
import Profile from './Profile';
import Settings from './Settings';
import NotFound from './NotFound';

const Dashboard = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="venues" element={<Venues />} />
      <Route path="users" element={<Users />} />
      <Route path="reports" element={<Reports />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="speakers" element={<Speakers />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Dashboard;
