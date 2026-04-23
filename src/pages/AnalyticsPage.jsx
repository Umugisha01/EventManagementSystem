import React from 'react';
import { RevenueChart, OccupancyChart, AttendanceLineChart } from '../components/Admin/Analytics';

const AnalyticsPage = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400">Explore performance metrics and event insights.</p>
      </div>
      <button className="glass-button">Refresh Data</button>
    </div>

    <div className="grid gap-6 xl:grid-cols-3">
      <div className="glass-card p-6 xl:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold">Revenue Trends</h3>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        <RevenueChart />
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold mb-6">Venue Health</h3>
        <OccupancyChart />
      </div>

      <div className="glass-card p-6 xl:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold">Attendance Pipeline</h3>
          <span className="text-xs text-gray-400">Hourly overview</span>
        </div>
        <div className="h-[260px]"><AttendanceLineChart /></div>
      </div>
    </div>
  </div>
);

export default AnalyticsPage;
