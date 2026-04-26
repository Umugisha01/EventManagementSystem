import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Armchair, Info, Loader2 } from 'lucide-react';
import { venuesApi } from '../../services/api';

const SeatMap = ({ venueId, eventId, pricingTiers, onSelect }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [occupiedIds, setOccupiedIds] = useState(['A101', 'A102', 'B205']); // Mix of mock and livedata

  useEffect(() => {
    const liveTaken = JSON.parse(localStorage.getItem(`taken_seats_${eventId}`) || '[]');
    setOccupiedIds(prev => [...new Set([...prev, ...liveTaken])]);
  }, [eventId]);

  useEffect(() => {
    if (venueId) {
      fetchSeats();
    }
  }, [venueId]);

  const fetchSeats = async () => {
    try {
      const data = await venuesApi.getVenue(venueId);
      setSeats(data.seats || []);
    } catch (err) {
      console.error('Failed to load seats:', err);
      setErrorMsg('Could not load venue layout.');
    } finally {
      setLoading(false);
    }
  };

  const getPriceForClass = (seatClass) => {
    const tier = pricingTiers?.find(t => t.seatClass.toLowerCase() === seatClass.toLowerCase());
    return tier ? `${tier.price.toLocaleString()} RWF` : 'N/A';
  };

  const getSeatColor = (seatClass) => {
    const cls = seatClass.toLowerCase();
    if (cls.includes('vvip')) return 'bg-event-gold';
    if (cls.includes('vip')) return 'bg-purple-500';
    if (cls.includes('cip')) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading) return (
    <div className="glass-card py-20 flex flex-col items-center justify-center">
       <Loader2 className="w-10 h-10 text-event-gold animate-spin mb-4" />
       <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Loading Live Venue Map...</p>
    </div>
  );

  // Group seats by Row for display
  const rowGroups = seats.reduce((acc, seat) => {
    const rowName = seat.row || 'General';
    if (!acc[rowName]) acc[rowName] = [];
    acc[rowName].push(seat);
    return acc;
  }, {});

  const handleSeatClick = (seat) => {
    const isOccupied = occupiedIds.includes(seat.id) || occupiedIds.includes(seat.seatNumber);
    if (seat.status !== 'Available' || isOccupied) {
      setErrorMsg('This seat is already booked.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setSelectedSeatId(seat.id);
    onSelect({
      id: seat.id,
      seatNumber: seat.seatNumber,
      type: seat.class,
      price: getPriceForClass(seat.class),
      color: getSeatColor(seat.class)
    });
  };

  return (
    <div className="glass-card p-10 border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-event-gold/50 to-transparent" />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
           <h3 className="text-xl font-bold flex items-center mb-1">
             <Armchair className="text-event-gold mr-3" />
             <span>Interactive Venue Layout</span>
           </h3>
           <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Pick your strategic position</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
           <LegendItem color="bg-event-gold" label="VVIP" />
           <LegendItem color="bg-purple-500" label="VIP" />
           <LegendItem color="bg-blue-500" label="CIP" />
           <LegendItem color="bg-green-500" label="Regular" />
           <LegendItem color="bg-white/10" label="Occupied" />
        </div>
      </div>

      {/* Stage */}
      <div className="w-full h-12 bg-white/5 border border-white/10 rounded-xl mb-24 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-event-gold/5 blur-xl group-hover:bg-event-gold/10 transition-all" />
          <span className="text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase z-10">THE STAGE / COURT AREA</span>
      </div>

      {/* Rows Container */}
      <div className="space-y-6 flex flex-col items-center">
        {Object.entries(rowGroups).map(([rowName, rowSeats]) => (
          <div key={rowName} className="flex items-center space-x-6">
            <span className="text-[10px] font-black w-12 text-right text-gray-600 uppercase">{rowName}</span>
            <div className="flex gap-2">
              {rowSeats.map(seat => {
                const isSelected = selectedSeatId === seat.id;
                const isOccupied = occupiedIds.includes(seat.id) || occupiedIds.includes(seat.seatNumber);
                
                return (
                  <motion.button
                    key={seat.id}
                    whileHover={!isOccupied ? { scale: 1.2, zIndex: 20 } : {}}
                    whileTap={!isOccupied ? { scale: 0.9 } : {}}
                    onClick={() => handleSeatClick(seat)}
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-all relative
                      ${isSelected ? 'scale-125 bg-white !text-black shadow-2xl shadow-white/50 z-10' : getSeatColor(seat.class)}
                      ${isOccupied ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:ring-2 ring-white/50 shadow-lg'}
                    `}
                    title={`${seat.class}: ${seat.seatNumber}`}
                  >
                    {!isSelected && !isOccupied && <Armchair className="w-4 h-4 text-black/30" />}
                    {isOccupied && <span className="text-[8px] font-black">X</span>}
                    {isSelected && <span className="text-[10px] font-black">{seat.seatNumber}</span>}
                  </motion.button>
                );
              })}
            </div>
            <span className="text-[10px] font-black w-12 text-left text-gray-600 uppercase">{rowName}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="bg-red-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl">
              {errorMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 p-6 bg-white/5 border border-white/5 rounded-2xl flex items-start space-x-4">
        <Info className="w-5 h-5 text-event-gold shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Dynamic Selection:</strong> Prices are live and synchronized with the event's strategic tiers. 
          VVIP and VIP sections include private hospitality access. Please confirm your selection in the summary card to proceed with MTN MoMo payment.
        </p>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2.5 h-2.5 rounded ${color}`} />
    <span className="text-gray-400">{label}</span>
  </div>
);

export default SeatMap;
