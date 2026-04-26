import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, User, Users, Ticket, CheckCircle2, Clock, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../components/Common/AuthContext';
import { eventsApi } from '../../services/api';

const EventAttendees = () => {
  const { user } = useAuth();
  const [filterEvent, setFilterEvent] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Manager's Events
        const allEvents = await eventsApi.getEvents();
        const myEvents = allEvents.filter(e => e.manager?.userName === user.username);
        setEvents(myEvents);

        // 2. Load Bookings (Simulating database fetch from localStorage for now)
        const allBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
        
        // Filter bookings that belong to this manager's events
        const managerEventTitles = myEvents.map(e => e.title);
        const myAttendees = allBookings.filter(b => managerEventTitles.includes(b.event)).map(b => ({
            id: b.id,
            name: b.userName || 'Verified Guest', 
            event: b.event,
            seats: b.seats.join(', '),
            status: b.status === 'Checked In' ? 'Checked In' : 'Registered',
            date: b.date,
            location: b.location
        }));

        setAttendees(myAttendees);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.username]);

  const filteredAttendees = attendees.filter(a => {
    const matchEvent = filterEvent === 'All' || a.event === filterEvent;
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        a.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEvent && matchSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="inline-flex items-center space-x-2 text-event-gold font-bold mb-2">
              <Users className="w-4 h-4" />
              <span className="uppercase tracking-[0.2em] text-[10px]">Strategic Oversight</span>
           </div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase">Attendee Registry</h1>
           <p className="text-[var(--text-secondary)] font-medium">Real-time validation and guest manifest for your assigned events.</p>
        </div>
        <button className="btn-primary py-4 px-8 flex items-center space-x-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-event-gold/20">
          <Download className="w-4 h-4" />
          <span>Export Manifest</span>
        </button>
      </div>

      <div className="glass-card p-8 border-white/5 bg-white/[0.02]">
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-event-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by guest name or unique ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 focus:border-event-gold outline-none font-bold placeholder:text-gray-700 transition-all"
            />
          </div>
          <div className="relative w-full lg:w-80">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select 
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 focus:border-event-gold outline-none font-black text-[10px] tracking-widest uppercase cursor-pointer"
            >
              <option value="All">All Operations</option>
              {events.map(e => (
                  <option key={e.id} value={e.title}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Security / ID</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Authorized Guest</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Deployment Event</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Position / Seat</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="p-6">
                     <span className="text-xs font-mono font-bold text-event-gold bg-event-gold/5 px-3 py-1 rounded-lg border border-event-gold/10">
                        {att.id}
                     </span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                           <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="font-black text-white italic uppercase tracking-tight">{att.name}</span>
                     </div>
                  </td>
                  <td className="p-6">
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-300">{att.event}</p>
                        <div className="flex items-center space-x-2 text-[8px] font-black uppercase text-gray-600 tracking-widest">
                           <Calendar className="w-3 h-3" />
                           <span>{att.date}</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-6 font-black text-event-gold tracking-widest text-xs italic">{att.seats}</td>
                  <td className="p-6 text-center">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                      att.status === 'Checked In' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/10' 
                        : 'bg-event-gold/10 text-event-gold border-event-gold/20 shadow-event-gold/10'
                    }`}>
                        {att.status === 'Checked In' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{att.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              
              {!loading && filteredAttendees.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-24 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-white/10 opacity-30">
                      <Users className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-600">Registry Is Empty</h3>
                    <p className="text-sm text-gray-700 mt-2 font-bold">No attendees match your strategic filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAttendees;
