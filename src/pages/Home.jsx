import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Ticket, ArrowRight, Star, Sparkles } from 'lucide-react';
import EventCard from '../components/Common/EventCard';
import { eventsApi } from '../services/api';

const Hero = ({ onExplore }) => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    {/* Background Accents */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-event-gold/10 blur-[120px] rounded-full -mr-64 -mt-32" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />

    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center space-x-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-2 rounded-full mb-6">
          <Star className="w-4 h-4 text-event-gold fill-event-gold" />
          <span className="text-sm font-medium">Rwanda's #1 Event Platform</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6 tracking-tighter">
          RWANDA <br />
          <span className="premium-gradient uppercase italic">EventHub</span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-lg leading-relaxed font-medium">
          Transforming Rwandan Event Venues with interactive seat-based booking, 
          MTN MoMo payments, and instant QR check-ins.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={onExplore} className="btn-primary flex items-center justify-center space-x-2 px-8">
            <span>Explore Events</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="glass-button">Venue Solutions</button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="glass-card p-4 relative overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800" 
            alt="Event" 
            className="rounded-xl w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="glass-card backdrop-blur-md p-6 bg-black/20 border-white/10">
              <h3 className="text-xl font-bold mb-1 text-white">Rwanda Tech Summit 2026</h3>
              <p className="text-gray-200 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Kigali Convention Centre
              </p>
            </div>
          </div>
        </div>
        {/* Floating Metrics */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-10 -right-10 glass-card p-4 text-center"
        >
          <p className="text-event-gold font-bold text-2xl">5K+</p>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Attendees</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Home = () => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const eventsRef = React.useRef(null);

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsApi.getEvents();
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="pb-20">
      <Hero onExplore={scrollToEvents} />
      
      <section ref={eventsRef} className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-event-gold font-bold mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm">Upcoming Experiences</span>
            </div>
            <h2 className="text-4xl font-bold">Featured Rwandan Events</h2>
          </div>
          <button onClick={scrollToEvents} className="glass-button text-sm">View All Events</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card h-80 animate-pulse bg-white/5 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        {!loading && events.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-12">No events found. Check back later!</p>
        )}
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
              <p className="text-sm font-black text-event-gold tracking-widest uppercase mb-2">Developed by Group 3</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Neema Christian • Mustafa Bukenya • Ishimwe Ange • Ishimwe Patrick
              </p>
            </div>
            <div className="flex items-center space-x-8 opacity-40">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">ASP.NET CORE 8.0</span>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">SQL SERVER 2022</span>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">© 2026 Rwanda EventHub • All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
