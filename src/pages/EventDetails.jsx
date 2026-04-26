import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  User,
  ArrowLeft,
  X,
  CreditCard,
  Ticket,
  Lock,
  Info
} from 'lucide-react';
import SeatMap from '../components/Booking/SeatMap';
import MomoPayment from '../components/Booking/MomoPayment';
import { useAuth } from '../components/Common/AuthContext';
import { eventsApi, bookingsApi, momoApi } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsApi.getEvent(id);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><div className="w-12 h-12 border-4 border-event-gold border-t-transparent rounded-full animate-spin" /></div>;
  
  if (!event) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-[#050505]">Event not found.</div>;

  const eventDate = event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'TBD';
  const eventTime = event.startDate ? new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBD';

  return (
    <div className="pb-20 bg-[#050505] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1600'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

        <div className="absolute bottom-12 left-0 w-full p-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="glass-button mb-8 flex items-center space-x-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Events</span>
            </button>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-event-gold/20 text-event-gold border border-event-gold/30 text-[10px] font-black uppercase tracking-widest mb-4">
               {event.category || 'Featured Event'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">{event.title}</h1>
            <div className="flex flex-wrap gap-8 text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg"><Calendar className="w-5 h-5 text-event-gold" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Date</span>
                  <span className="font-bold">{eventDate}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg"><MapPin className="w-5 h-5 text-event-gold" /></div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Venue</span>
                   <span className="font-bold">{event.venue?.name || 'TBD'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg"><Clock className="w-5 h-5 text-event-gold" /></div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Doors Open</span>
                   <span className="font-bold">{eventTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 mt-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-16">
          <section className="glass-card p-10 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Info className="w-40 h-40" />
            </div>
            <h2 className="text-3xl font-bold mb-6 flex items-center">
               <span className="w-10 h-1 bg-event-gold mr-4 rounded-full" />
               Experience Brief
            </h2>
            <p className="text-gray-400 leading-relaxed text-xl font-medium">
              {event.description || 'Welcome to an exclusive experience at Rwanda Event Hub. This curated gathering brings together high-caliber professionals and cultural enthusiasts for a day of innovation and connection.'}
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-bold italic tracking-tighter uppercase">Interactive Seat Map</h2>
               <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-event-gold" />
                  <span>Real-time availability</span>
               </div>
            </div>
            <SeatMap venueId={event.venueId} eventId={event.id} pricingTiers={event.pricingTiers} onSelect={setSelectedSeat} />
          </section>
        </div>

        {/* Right Column: Sidebar / Booking */}
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

                  {user ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="btn-primary w-full py-4 flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Confirm & Pay</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-primary w-full py-4 flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Login to Book</span>
                    </button>
                  )}
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
                Secure payments processed via MTN MoMo API. Official digital tickets with QR
                codes delivered instantly via email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg p-8 relative z-10 bg-[#1A1A1A]"
            >
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold mb-8">MoMo Checkout</h2>

              <MomoPayment
                amount={selectedSeat?.price}
                onComplete={async (momoDetails) => {
                  try {
                    const bookingId = `REH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                    
                    // 1. Create actual booking record for the UI
                    const newBooking = {
                      id: bookingId,
                      event: event.title,
                      date: eventDate,
                      location: event.venue?.name || 'Kigali Venue',
                      seats: [selectedSeat.id],
                      status: 'confirmed',
                      price: selectedSeat.price,
                      qr: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${bookingId}-SEAT-${selectedSeat.id}`
                    };

                    // Save to user bookings
                    const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
                    localStorage.setItem('myBookings', JSON.stringify([...myBookings, newBooking]));

                    // Mark seat as taken physically in local state (simulation)
                    const takenSeats = JSON.parse(localStorage.getItem(`taken_seats_${id}`) || '[]');
                    localStorage.setItem(`taken_seats_${id}`, JSON.stringify([...takenSeats, selectedSeat.id]));

                    // 2. Optional: Notify backend (using demo data here for simulation)
                    try {
                       await bookingsApi.createBooking({
                         eventId: id,
                         seatId: selectedSeat.id,
                         userId: user.id
                       });
                    } catch (e) {
                       console.warn('Backend sync failed, but local booking persisted.');
                    }

                    setShowCheckout(false);
                    navigate('/dashboard/bookings');
                  } catch (error) {
                    alert('Booking failed: ' + error.toString());
                  }
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal dummy arm chair for missing icon in this file
const Armchair = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" /><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" /><path d="M5 18v2" /><path d="M19 20v-2" /></svg>
);

export default EventDetails;
