import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, CreditCard, CheckCircle2, ChevronRight, X, Phone, Smartphone, ShieldCheck } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Common/AuthContext';
import { bookingsApi } from '../../services/api';

const BookingFlow = () => {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [showMomo, setShowMomo] = useState(false);
  const [momoStatus, setMomoStatus] = useState('idle'); // idle, prompt, pending, success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const SEATS = Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    type: i < 8 ? 'VVIP' : i < 20 ? 'VIP' : i < 36 ? 'Regular' : 'General',
    price: i < 8 ? 50000 : i < 20 ? 25000 : i < 36 ? 15000 : 5000,
  }));

  const getTypeColor = (type) => {
    switch (type) {
      case 'VVIP': return 'bg-event-gold';
      case 'VIP': return 'bg-purple-500';
      case 'Regular': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const toggleSeat = (seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const startPayment = () => {
    setMomoStatus('prompt');
    setShowMomo(true);
  };

  const confirmPayment = async () => {
    // MTN Rwanda validation: 10 digits starting with 078 or 079
    const mtnRegex = /^(078|079)\d{7}$/;
    if (!mtnRegex.test(phoneNumber)) {
      setPhoneError('Please enter a valid MTN number (e.g., 078xxxxxxx or 079xxxxxxx)');
      return;
    }
    setPhoneError('');
    setMomoStatus('pending');
    
    try {
      // Create bookings in the database for each selected seat
      for (const seat of selectedSeats) {
         await bookingsApi.createBooking({
            eventId: parseInt(eventId),
            userId: user.id,
            seatId: seat.id, // Assuming Mock Seat ID matches DB Seat ID for this event
            bookingStatus: "Confirmed",
            paymentStatus: "Success",
            totalPrice: seat.price
         });
      }
      
      setMomoStatus('success');
      setTimeout(() => {
        navigate('/dashboard/bookings');
      }, 1500);
    } catch (err) {
      console.error("Booking failed:", err);
      setPhoneError("System Error: Failed to secure seats. Please try again.");
      setMomoStatus('prompt');
    }
  };

  if (momoStatus === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Booking Success!</h1>
          <p className="text-[var(--text-secondary)]">Your QR tickets have been sent to your email and are available in your dashboard.</p>
        </div>
        <button onClick={() => navigate('/dashboard/bookings')} className="btn-primary w-full py-4">View My Tickets</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12 pt-10">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Rwanda Tech Summit 2026</h1>
          <p className="text-[var(--text-secondary)]">Interact with the map to select your preferred seats.</p>
        </div>

        {/* Seat Map */}
        <div className="glass-card p-8">
          <div className="w-full h-12 bg-white/5 border border-[var(--border-color)] rounded-t-full flex items-center justify-center mb-12 text-xs uppercase tracking-widest text-[var(--text-secondary)] font-bold">
            Stage / Front of House
          </div>
          
          <div className="grid grid-cols-8 gap-4 mb-12">
            {SEATS.map(seat => {
              const isSelected = selectedSeats.find(s => s.id === seat.id);
              return (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat)}
                  className={`h-8 rounded-t-lg transition-all transform hover:scale-110 ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-primary)] opacity-100' : 'opacity-40'
                  } ${getTypeColor(seat.type)}`}
                  title={`${seat.type} - ${seat.price} RWF`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-6 justify-center pt-8 border-t border-[var(--border-color)]">
            {['VVIP', 'VIP', 'Regular', 'General'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
                <span className="text-xs text-[var(--text-secondary)]">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="space-y-6">
        <div className="glass-card p-6 sticky top-24">
          <h3 className="font-bold border-b border-[var(--border-color)] pb-4 mb-6">Booking Summary</h3>
          
          <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto">
            {selectedSeats.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center py-4">No seats selected yet</p>
            ) : (
              selectedSeats.map(seat => (
                <div key={seat.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getTypeColor(seat.type)}`} />
                    <span>Seat #{seat.id} ({seat.type})</span>
                  </div>
                  <span className="font-bold">{seat.price.toLocaleString()} RWF</span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[var(--border-color)] pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Total Amount</span>
              <span className="text-2xl font-bold text-event-gold">{totalPrice.toLocaleString()} RWF</span>
            </div>
            <button 
              disabled={selectedSeats.length === 0}
              onClick={startPayment}
              className="w-full btn-primary py-4 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-5 h-5" />
              <span>Checkout via MTN MoMo</span>
            </button>
          </div>
        </div>
      </div>

      {/* MoMo Simulation Modal */}
      <AnimatePresence>
        {showMomo && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-yellow-400 text-black w-full max-w-xs p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-black/40 font-bold text-xs uppercase tracking-widest">MTN MOMO</div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Smartphone className="w-7 h-7" />
              </div>

              {momoStatus === 'prompt' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black leading-tight uppercase">Confirm Payment?</h2>
                  <p className="text-sm font-medium leading-relaxed opacity-80">
                    You are paying <strong>{totalPrice.toLocaleString()} RWF</strong> to <strong>Rwanda EventHub</strong>.
                  </p>
                  
                  <div className="pt-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/60 block mb-2">MTN Mobile Number</label>
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="078 XXX XXXX"
                      className="w-full bg-white/40 border-2 border-black/10 rounded-xl px-4 py-3 text-black font-black outline-none focus:border-black/30 placeholder:text-black/30"
                    />
                    {phoneError && <p className="text-red-600 text-xs font-bold mt-2 bg-red-100 p-2 rounded-lg">{phoneError}</p>}
                  </div>

                  <div className="space-y-3 pt-2">
                    <button onClick={confirmPayment} className="w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all">ENTER PIN & PAY</button>
                    <button onClick={() => setShowMomo(false)} className="w-full bg-transparent border-2 border-black/10 font-bold py-3 rounded-2xl">CANCEL</button>
                  </div>
                </div>
              )}

              {momoStatus === 'pending' && (
                <div className="flex flex-col items-center py-12 space-y-6 text-center">
                  <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                  <p className="font-black uppercase tracking-widest text-sm">Processing USSD...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingFlow;
