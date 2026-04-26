import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Search, Filter, MoreVertical, Trash2, Edit, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../../services/api';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.manager?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-[var(--text-secondary)]">Overview of all created events and their assigned managers.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/events/new')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-[var(--border-color)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search events by title, venue or manager..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-[var(--border-color)] rounded-xl py-2 pl-12 pr-4 focus:border-event-gold outline-none text-sm"
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-event-gold outline-none cursor-pointer"
          >
             <option value="All">All Operations</option>
             <option value="Published">Live Events</option>
             <option value="Scheduled">Drafting</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 flex flex-col md:flex-row items-center justify-between group gap-6"
            >
              <div className="flex items-center space-x-6 w-full md:w-auto">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src={event.imageUrl || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-event-gold transition-colors">{event.title}</h3>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2">
                    <div className="flex items-center text-xs text-[var(--text-secondary)]">
                      <Calendar className="w-3 h-3 mr-1 text-event-gold" />
                      <span>{event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date TBD'}</span>
                    </div>
                    <div className="flex items-center text-xs text-[var(--text-secondary)]">
                      <MapPin className="w-3 h-3 mr-1 text-event-gold" />
                      <span>{event.venue?.name || 'No Venue'}</span>
                    </div>
                    <div className="flex items-center text-xs text-[var(--text-secondary)]">
                      <Users className="w-3 h-3 mr-1 text-event-gold" />
                      <span>Manager: <span className="text-event-gold font-bold ml-1">{event.manager?.fullName || 'System'}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex-1 md:flex-none text-center px-6 border-r border-white/10">
                  <p className="text-[10px] uppercase text-[var(--text-secondary)] font-bold mb-1">Status</p>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${event.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => navigate(`/event/${event.id}`)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Public Page">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button onClick={() => navigate(`/dashboard/events/new`, { state: { editEvent: event } })} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-event-gold transition-colors" title="Edit Event">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-card">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No events created yet.</p>
            <button onClick={() => navigate('/dashboard/events/new')} className="text-event-gold font-bold hover:underline mt-2">Create your first event</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
