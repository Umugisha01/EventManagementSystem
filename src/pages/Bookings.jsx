import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { EVENTS } from '../data/events';

const INITIAL_BOOKINGS = [
  { id: 'B-1023', event: 'Rwanda Tech Summit 2026', customer: 'Alice Mugwaneza', seat: 'A3', status: 'Confirmed', amount: '50,000 RWF' },
  { id: 'B-1076', event: 'Visit Rwanda Tourism Gala', customer: 'John Habimana', seat: 'B6', status: 'Pending', amount: '30,000 RWF' },
  { id: 'B-1102', event: 'Kigali Creative Expo', customer: 'Sarah Uwimana', seat: 'C12', status: 'Confirmed', amount: '20,000 RWF' },
];

const Bookings = () => {
  const [bookingList, setBookingList] = useState(INITIAL_BOOKINGS);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    eventId: '',
    customer: '',
    seat: '',
    paymentMethod: 'MoMo',
    status: 'Pending',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEvent = EVENTS.find(event => event.id === bookingForm.eventId);
    const newBooking = {
      id: `B-${Date.now().toString().slice(-4)}`,
      event: selectedEvent.title,
      customer: bookingForm.customer,
      seat: bookingForm.seat,
      status: bookingForm.status,
      amount: selectedEvent.price,
    };

    setBookingList((prev) => [newBooking, ...prev]);
    setBookingForm({
      eventId: '',
      customer: '',
      seat: '',
      paymentMethod: 'MoMo',
      status: 'Pending',
    });
    setShowNewBookingModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400 mt-1">Manage event bookings and reservations</p>
        </div>
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Booking
        </button>
      </div>

      {/* Booking Creation Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create New Booking</h2>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Event
                </label>
                <select
                  name="eventId"
                  value={bookingForm.eventId}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose an event...</option>
                  {EVENTS.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {event.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer"
                  value={bookingForm.customer}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter customer name"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seat Number
                </label>
                <input
                  type="text"
                  name="seat"
                  value={bookingForm.seat}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., A5, B12"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={bookingForm.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MoMo">Mobile Money (MoMo)</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={bookingForm.status}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Seat
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bookingList.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {booking.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {booking.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {booking.seat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {booking.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
