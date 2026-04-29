import { TrendingUp, Users, Calendar, DollarSign, Download, Plus, BarChart, CheckCircle2, X } from 'lucide-react';
import { RevenueChart, OccupancyChart, AttendanceLineChart } from '../components/Admin/Analytics';
import { useState } from 'react';

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
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: '',
    date: '',
    location: '',
    price: '',
    attendees: '',
    description: '',
    highlights: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Creating new event:', eventForm);
    // Reset form and close modal
    setEventForm({
      title: '',
      category: '',
      date: '',
      location: '',
      price: '',
      attendees: '',
      description: '',
      highlights: '',
      image: ''
    });
    setShowNewEventModal(false);
    // You could show a success message here
  };
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
          <button className="btn-primary flex items-center space-x-2 !px-6 py-2 text-sm" onClick={() => setShowNewEventModal(true)}>
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

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Create New Event</h2>
              <button
                onClick={() => setShowNewEventModal(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={eventForm.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="technology">Technology</option>
                    <option value="tourism">Tourism</option>
                    <option value="creative">Creative</option>
                    <option value="business">Business</option>
                    <option value="sports">Sports</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Enter venue location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (RWF)</label>
                  <input
                    type="number"
                    name="price"
                    value={eventForm.price}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Attendees</label>
                  <input
                    type="number"
                    name="attendees"
                    value={eventForm.attendees}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={4}
                  name="description"
                  value={eventForm.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold resize-none"
                  placeholder="Describe your event..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Highlights (comma-separated)</label>
                <input
                  type="text"
                  name="highlights"
                  value={eventForm.highlights}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="e.g., Networking, Workshops, Awards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={eventForm.image}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
                  className="glass-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
