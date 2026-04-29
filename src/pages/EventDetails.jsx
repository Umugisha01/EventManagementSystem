import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  X,
  CreditCard,
  Ticket,
} from 'lucide-react';
import { getEventById } from '../data/events';
import SeatMap from '../components/Booking/SeatMap';
import MomoPayment from '../components/Booking/MomoPayment';
import NotFound from './NotFound';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const event = useMemo(() => getEventById(id), [id]);

  if (!event) {
    return <NotFound />;
  }

  return (
    <div className="pb-20">
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-event-charcoal via-event-charcoal/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className="glass-button mb-8 flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </button>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-event-gold" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-event-gold" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-event-gold" />
                <span>09:00 AM - 05:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 mt-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 rounded-full bg-event-gold text-black text-xs font-semibold">{event.category}</span>
              <span className="text-sm text-gray-400">{event.attendees} attendees</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">About the Event</h2>
            <p className="text-gray-400 leading-relaxed text-lg">{event.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Featured Speakers</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {event.speakers.map((speaker) => (
                <div key={speaker.name} className="glass-card p-4 flex items-center space-x-4">
                  <img src={speaker.avatar} alt={speaker.name} className="w-16 h-16 rounded-xl border border-white/10" />
                  <div>
                    <h4 className="font-bold">{speaker.name}</h4>
                    <p className="text-sm text-event-gold">{speaker.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SeatMap onSelect={setSelectedSeat} />
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="glass-card p-6 border-event-gold/20">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Ticket className="text-event-gold" />
                <span>Ticket Selection</span>
              </h3>

              {selectedSeat ? (
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm italic">Selected Seat</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedSeat.color} text-black`}>
                        {selectedSeat.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-bold text-event-gold">{selectedSeat.id}</span>
                      <span className="text-xl font-bold">{selectedSeat.price}</span>
                    </div>
                  </div>

                  <button onClick={() => setShowCheckout(true)} className="btn-primary w-full py-4 flex items-center justify-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Confirm & Pay</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                  <Armchair className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">Select a seat from the map to proceed with booking</p>
                </div>
              )}
            </div>

            <div className="glass-card p-6 bg-blue-500/5 border-blue-500/10">
              <h4 className="font-bold mb-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Rwanda Hub Promise</span>
              </h4>
              <p className="text-xs text-blue-400 leading-relaxed italic">
                Secure payments processed via MTN MoMo API. Official digital tickets with QR codes delivered instantly via email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCheckout(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-card w-full max-w-lg p-8 relative z-10 bg-[#1A1A1A]">
              <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X />
              </button>
              <h2 className="text-2xl font-bold mb-8">MoMo Checkout</h2>
              <MomoPayment amount={selectedSeat?.price} onComplete={() => {
                alert('Booking Successful! Check your email for the QR ticket.');
                setShowCheckout(false);
                navigate('/dashboard');
              }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Armchair = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 20v-2"/></svg>
);

export default EventDetails;
