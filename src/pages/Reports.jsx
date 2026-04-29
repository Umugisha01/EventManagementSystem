import React from 'react';
import { FileText, PieChart, Activity, ShieldCheck } from 'lucide-react';

const REPORTS = [
  { title: 'Sales Report', subtitle: 'Monthly revenue breakdown', stat: '1.2M RWF', icon: FileText, variant: 'gold' },
  { title: 'Bookings Report', subtitle: 'Ticket trends and conversion', stat: '3.4K', icon: Activity, variant: 'green' },
  { title: 'Attendance Report', subtitle: 'Venue utilization and safety', stat: '84%', icon: PieChart, variant: 'blue' },
  { title: 'Security Audit', subtitle: 'Access logs and compliance', stat: '97%', icon: ShieldCheck, variant: 'purple' },
];

const Reports = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-400">Review the latest operational and security analytics for the platform.</p>
      </div>
      <button className="glass-button">Download Dashboard</button>
    </div>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {REPORTS.map((report) => (
        <div key={report.title} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{report.title}</h2>
              <p className="text-sm text-gray-400">{report.subtitle}</p>
            </div>
            <report.icon className={`w-6 h-6 text-${report.variant}-400`} />
          </div>
          <p className="text-3xl font-bold">{report.stat}</p>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="w-4/5 h-full bg-event-gold" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Reports;
