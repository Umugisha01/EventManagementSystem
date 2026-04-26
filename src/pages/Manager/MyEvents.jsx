import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, TrendingUp, CheckCircle2, Clock, ArrowRight, BarChart3, Tag } from 'lucide-react';
import { useAuth } from '../../components/Common/AuthContext';
import { eventsApi } from '../../services/api';

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const data = await eventsApi.getEvents();
        // For now, filter by manager name or show all if user is manager
        const myEvents = data.filter(e => e.manager?.userName === user.username);
        setEvents(myEvents);
      } catch (err) {
        console.error('Failed to fetch my events:', err);
      }
    };
    fetchMyEvents();
  }, [user.username]);

  const filteredEvents = events.filter(event => {
    const startDate = new Date(event.startDate);
    const today = new Date();
    return filter === 'upcoming' ? startDate >= today : startDate < today;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase">My Directives</h1>
           <p className="text-[var(--text-secondary)] font-medium">Strategic oversight for your assigned Rwandan experiences.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-xl border border-white/5">
           <button onClick={() => setFilter('upcoming')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === 'upcoming' ? 'bg-event-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Active</button>
           <button onClick={() => setFilter('past')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === 'past' ? 'bg-event-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Historical</button>
        </div>
      </div>

      <div className="grid gap-8">
        {filteredEvents.map(event => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden grid md:grid-cols-12 group hover:border-event-gold/30 transition-all border-white/5"
          >
            {/* Image Section */}
            <div className="md:col-span-3 relative h-48 md:h-full overflow-hidden">
              <img 
                src={event.imageUrl || 'https://via.placeholder.com/800x600'} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-black/80 backdrop-blur-md text-event-gold text-[10px] font-black px-3 py-1 rounded-full border border-event-gold/30 uppercase tracking-widest">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="md:col-span-6 p-8 border-r border-white/5">
              <h3 className="text-3xl font-black mb-6 group-hover:text-event-gold transition-colors tracking-tighter uppercase italic">{event.title}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-4 text-[var(--text-secondary)]">
                   <Calendar className="w-5 h-5 text-event-gold" />
                   <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-black text-gray-600">Start Date</span>
                      <span className="text-xs font-bold text-gray-300">{new Date(event.startDate).toLocaleDateString()}</span>
                   </div>
                </div>
                <div className="flex items-center space-x-4 text-[var(--text-secondary)]">
                   <MapPin className="w-5 h-5 text-event-gold" />
                   <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-black text-gray-600">Location</span>
                      <span className="text-xs font-bold text-gray-300">{event.venue?.name}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => navigate(`/dashboard/events/report/${event.id}`)}
                  className="flex-1 btn-primary py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2"
                 >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Strategic Report</span>
                 </button>
                 <button 
                  onClick={() => navigate('/dashboard/attendees', { state: { eventId: event.id } })}
                  className="glass-button p-4 hover:bg-event-gold hover:text-black transition-all group"
                 >
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </button>
              </div>
            </div>

            {/* Analytics Column */}
            <div className="md:col-span-3 p-8 bg-white/[0.02] flex flex-col justify-center space-y-6">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1">Gross Revenue</p>
                <div className="flex items-baseline justify-center space-x-1">
                  <p className="text-2xl font-black text-white">{event.analytics?.revenue || '0 RWF'}</p>
                </div>
                <div className="flex items-center justify-center space-x-1 text-green-500 text-[10px] mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{event.analytics?.trend || '+0%'} from last week</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                  <span>Capacity Utilized</span>
                  <span className="text-event-gold">{Math.round((event.analytics?.checkins / event.analytics?.capacity) * 100) || 0}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-event-gold transition-all duration-1000" 
                    style={{ width: `${(event.analytics?.checkins / event.analytics?.capacity) * 100 || 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-center text-[var(--text-secondary)] mt-1">
                  {event.analytics?.checkins || 0} / {event.analytics?.capacity || 0} Seats Occupied
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button className="w-full flex items-center justify-center space-x-2 text-[var(--text-secondary)] hover:text-event-gold transition-colors p-2 text-xs font-bold">
                  <BarChart3 className="w-4 h-4" />
                  <span>View Detailed Report</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 glass-card">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No {filter} events found for your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
