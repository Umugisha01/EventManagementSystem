import React from 'react';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card overflow-hidden group border-[var(--border-color)] hover:border-event-gold/50 transition-colors flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800'} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-event-gold text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">
          {event.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center space-x-2 text-event-gold text-[10px] font-black uppercase tracking-widest mb-3">
          <Calendar className="w-3 h-3" />
          <span>{event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD'}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-event-gold transition-colors text-[var(--text-primary)] tracking-tight">
          {event.title}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed italic">
           {event.description || 'Experience the best of Rwanda Events Hub with interactive seating and secure booking.'}
        </p>
        
        <div className="space-y-2 mb-8 mt-auto">
          <div className="flex items-center text-[var(--text-secondary)] text-sm font-medium">
            <MapPin className="w-4 h-4 mr-2 text-event-gold" />
            <span>{event.venue?.name || 'TBD'}</span>
          </div>
          <div className="flex items-center text-[var(--text-secondary)] text-xs">
            <Users className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-gray-500">{event.venue?.capacity || '0'} Total Capacity</span>
          </div>
        </div>
        
        <Link 
          to={`/event/${event.id}`} 
          className="flex items-center justify-between w-full font-bold group/btn text-[var(--text-primary)] border-t border-[var(--border-color)] pt-5"
        >
          <span className="text-sm">Book Securely</span>
          <div className="p-2 rounded-full bg-[var(--glass-bg)] group-hover/btn:bg-event-gold group-hover/btn:text-black transition-all border border-[var(--glass-border)]">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
