import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Star, Sparkles } from 'lucide-react';
import EventCard from '../components/Common/EventCard';
import { EVENTS } from '../data/events';

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-event-gold/10 blur-[120px] rounded-full -mr-64 -mt-32" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />

    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
          <Star className="w-4 h-4 text-event-gold fill-event-gold" />
          <span className="text-sm font-medium">Rwanda's #1 Event Platform</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
          Transforming <br />
          <span className="premium-gradient">Rwandan Events</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
          The all-in-one platform for venue management, seat-based booking, and instant MTN MoMo payments. Built for the modern event experience.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
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
            <div className="glass-card backdrop-blur-md p-6 bg-black/40 border-white/20">
              <h3 className="text-xl font-bold mb-1">Rwanda Tech Summit 2026</h3>
              <p className="text-gray-300 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Kigali Convention Centre
              </p>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-10 -right-10 glass-card p-4 text-center"
        >
          <p className="text-event-gold font-bold text-2xl">5K+</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Attendees</p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Home = () => {
  return (
    <div className="pb-20">
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-event-gold font-bold mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm">Upcoming Experiences</span>
            </div>
            <h2 className="text-4xl font-bold">Featured Rwandan Events</h2>
          </div>
          <button className="glass-button text-sm">View All Events</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 lg:grid-cols-3">
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-2xl font-bold">Why Rwanda EventHub?</h3>
            <p className="text-gray-400 leading-relaxed">
              Built specifically for Rwanda’s thriving event and venue ecosystem, offering secure ticketing, local payment flows, and polished event experiences.
            </p>
          </div>
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-event-gold text-black font-bold">01</span>
              <div>
                <h4 className="font-semibold">Fast booking</h4>
                <p className="text-gray-400 text-sm">Select seats and complete payment in minutes.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-event-gold text-black font-bold">02</span>
              <div>
                <h4 className="font-semibold">Venue control</h4>
                <p className="text-gray-400 text-sm">Manage capacity, seating, and arrival flow from one panel.</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-event-gold text-black font-bold">03</span>
              <div>
                <h4 className="font-semibold">Local payments</h4>
                <p className="text-gray-400 text-sm">Supports MTN MoMo with a smooth checkout flow for attendees.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-event-gold text-black font-bold">04</span>
              <div>
                <h4 className="font-semibold">Actionable insights</h4>
                <p className="text-gray-400 text-sm">Track attendance, revenue, and event health in real time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
