import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Armchair, Info } from 'lucide-react';

const SEAT_TYPES = {
  VIP: { color: 'bg-vip-gold', price: '50,000 RWF', text: 'text-vip-gold' },
  REGULAR: { color: 'bg-regular-green', price: '25,000 RWF', text: 'text-regular-green' },
  GENERAL: { color: 'bg-general-blue', price: '10,000 RWF', text: 'text-general-blue' },
};

const SeatMap = ({ onSelect }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Generate mock seats
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  const getSeatType = (row) => {
    if (row === 'A') return 'VIP';
    if (['B', 'C'].includes(row)) return 'REGULAR';
    return 'GENERAL';
  };

  const handleSeatClick = (seatId, type) => {
    setSelectedSeat(seatId);
    onSelect({ id: seatId, type, ...SEAT_TYPES[type] });
  };

  return (
    <div className="glass-card p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Armchair className="text-event-gold" />
          <span>Select Your Seat</span>
        </h3>
        
        <div className="flex space-x-6 text-sm">
          {Object.entries(SEAT_TYPES).map(([type, info]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${info.color}`} />
              <span className="text-gray-400 capitalize">{type.toLowerCase()}</span>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <span className="text-gray-400">Occupied</span>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="w-full h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-full mb-20 relative">
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          Stage / Screen
        </p>
      </div>

      {/* Seats Grid */}
      <div className="flex flex-col items-center space-y-4">
        {rows.map(row => (
          <div key={row} className="flex space-x-3 items-center">
            <span className="text-xs text-gray-600 w-4 font-bold">{row}</span>
            <div className="flex space-x-2">
              {cols.map(col => {
                const seatId = `${row}${col}`;
                const type = getSeatType(row);
                const isSelected = selectedSeat === seatId;
                const isOccupied = Math.random() < 0.2; // Mock occupancy

                return (
                  <motion.button
                    key={seatId}
                    whileHover={!isOccupied ? { scale: 1.2 } : {}}
                    whileTap={!isOccupied ? { scale: 0.9 } : {}}
                    disabled={isOccupied}
                    onClick={() => handleSeatClick(seatId, type)}
                    className={`
                      w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200
                      ${isSelected ? 'scale-125 !bg-white !text-black shadow-xl shadow-white/20 z-10' : ''}
                      ${isOccupied ? 'bg-white/5 cursor-not-allowed opacity-30' : SEAT_TYPES[type].color}
                    `}
                  >
                    {!isSelected && !isOccupied && <Armchair className="w-4 h-4 text-black/40" />}
                    {isSelected && <span className="text-[10px] font-bold">{seatId}</span>}
                  </motion.button>
                );
              })}
            </div>
            <span className="text-xs text-gray-600 w-4 font-bold">{row}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-xl flex items-start space-x-3">
        <Info className="w-5 h-5 text-event-gold shrink-0" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Hover over seats to see pricing. VIP seats include lounge access and complementary drinks. 
          Seats in row A are limited.
        </p>
      </div>
    </div>
  );
};

export default SeatMap;
