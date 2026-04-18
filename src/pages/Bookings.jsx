import React from 'react';

const BOOKINGS = [
  { id: 'B-1023', event: 'Rwanda Tech Summit 2026', customer: 'Alice Mugwaneza', seat: 'A3', status: 'Confirmed', amount: '50,000 RWF' },
  { id: 'B-1076', event: 'Visit Rwanda Tourism Gala', customer: 'John Habimana', seat: 'B6', status: 'Pending', amount: '30,000 RWF' },
  { id: 'B-1102', event: 'Kigali Creative Expo', customer: 'Sarah Uwimana', seat: 'C12', status: 'Confirmed', amount: '20,000 RWF' },
];

const Bookings = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-gray-400">Track ticket orders, payment status, and seat allocations.</p>
      </div>
      <button className="btn-primary">Create Booking</button>
    </div>

    <div className="glass-card overflow-hidden border-white/10">
      <table className="min-w-full text-left">
        <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Booking ID</th>
            <th className="px-6 py-4">Event</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Seat</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {BOOKINGS.map((booking) => (
            <tr key={booking.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">{booking.id}</td>
              <td className="px-6 py-4">{booking.event}</td>
              <td className="px-6 py-4">{booking.customer}</td>
              <td className="px-6 py-4">{booking.seat}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4">{booking.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Bookings;
