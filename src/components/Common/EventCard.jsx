import React from 'react';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card overflow-hidden group border-white/5 hover:border-event-gold/50 transition-colors"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-event-gold text-black text-xs font-bold px-3 py-1 rounded-full px-3">
          {event.category}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-event-gold text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3 h-3" />
          <span>{event.date}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 group-hover:text-event-gold transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Users className="w-4 h-4 mr-2" />
            <span>{event.attendees} Registered</span>
          </div>
        </div>
        
        <Link 
          to={`/event/${event.id}`} 
          className="flex items-center justify-between w-full font-bold group/btn"
        >
          <span className="text-sm">Book Securely</span>
          <div className="p-2 rounded-full bg-white/5 group-hover/btn:bg-event-gold group-hover/btn:text-black transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
