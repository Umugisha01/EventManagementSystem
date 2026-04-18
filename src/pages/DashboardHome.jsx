import { TrendingUp, Users, Calendar, DollarSign, Download, Plus, BarChart, CheckCircle2 } from 'lucide-react';
import { RevenueChart, OccupancyChart, AttendanceLineChart } from '../components/Admin/Analytics';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="glass-card p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        <Icon className="w-6 h-6 text-event-gold" />
      </div>
      <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Overview</h1>
          <p className="text-gray-400">Welcome back, Admin. Here’s what is happening across your event ecosystem.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="glass-button flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="btn-primary flex items-center space-x-2 !px-6 py-2 text-sm">
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="12,450,000 RWF" icon={DollarSign} trend="+12.5%" />
        <StatCard title="Total Attendees" value="5,842" icon={Users} trend="+8.2%" />
        <StatCard title="Active Events" value="18" icon={Calendar} trend="+2.4%" />
        <StatCard title="Avg. Occupancy" value="84%" icon={TrendingUp} trend="+5.1%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-event-gold" />
              <span>Revenue by Seat Type</span>
            </h3>
            <span className="text-xs text-gray-400">Values in RWF</span>
          </div>
          <RevenueChart />
        </div>

        <div className="glass-card p-6 flex flex-col items-center">
          <h3 className="font-bold w-full text-left mb-6">Venue Utilization</h3>
          <div className="w-full max-w-[240px] mb-6">
            <OccupancyChart />
          </div>
          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Check-ins</span>
              <span className="font-bold text-green-400">1,180 / 1,400</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[84%] h-full bg-event-gold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-event-gold" />
              <span>Real-time Attendance Flow</span>
            </h3>
            <div className="flex space-x-4 text-xs font-medium uppercase tracking-widest text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-event-gold" />
                <span>Today</span>
              </div>
            </div>
          </div>
          <div className="h-[240px]">
            <AttendanceLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
