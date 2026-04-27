import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode, Download, Printer, CheckCircle2, MoreHorizontal, Search, Loader2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../../components/Common/AuthContext';
import { bookingsApi } from '../../services/api';

const Bookings = () => {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingsApi.getUserHistory(user.id);
        const mapped = data.map(b => ({
          id: b.qrTicketCode || `REH-${b.id}`,
          originalId: b.id,
          event: b.event?.title || "Event Hub Premium",
          date: b.event?.date ? new Date(b.event.date).toLocaleDateString() : "May 15-17, 2026",
          location: b.event?.location || "Convention Centre",
          seats: b.seat?.seatNumber ? [b.seat.seatNumber] : ["Assigned Seat"],
          status: b.bookingStatus.toLowerCase(),
          price: `${b.totalPrice.toLocaleString()} RWF`,
          attendeeName: b.user?.fullName || user?.fullName || "Verified Guest",
          attendeeEmail: b.user?.email || user?.email || "guest@eventhub.rw",
          purchasedAt: new Date(b.bookingDate).toLocaleString(),
          checkedInBy: b.checkedInByStaff?.fullName || null,
          checkedInAt: b.checkedInAt ? new Date(b.checkedInAt).toLocaleString() : null,
          qr: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=REH-${b.eventId}-${b.id}`
        }));
        setBookings(mapped);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) loadBookings();
  }, [user?.id]);

  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDownloadPDF = async (booking) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Background (Dark)
    doc.setFillColor(5, 5, 5);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Gold Accent Borders
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190);
    
    // Brand Section (Top Left)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(212, 175, 55);
    doc.text("RWANDA EVENT HUB", 25, 35);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("OFFICIAL LANDSCAPE ADMISSION PASS • SECURE TICKET PRO", 25, 45);

    // Main Content Split
    doc.setDrawColor(30, 30, 30);
    doc.line(160, 30, 160, 180); // Vertical Divider

    // Event Info (Left Side)
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(booking.event.toUpperCase(), 25, 75);

    const leftInfo = [
      { l: "BOOKING ID", v: booking.id },
      { l: "DATE & TIME", v: booking.date },
      { l: "VENUE", v: booking.location },
      { l: "SEAT(S)", v: booking.seats.join(', ') },
      { l: "TOTAL PRICE", v: booking.price }
    ];

    let ly = 95;
    leftInfo.forEach(item => {
      doc.setFontSize(7);
      doc.setTextColor(212, 175, 55);
      doc.text(item.l, 25, ly);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(String(item.v), 25, ly+6);
      ly += 16;
    });

    // Attendee Detail (Right Side)
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text("ATTENDEE CREDENTIALS", 175, 45);
    
    const rightInfo = [
      { l: "FULL NAME", v: booking.attendeeName },
      { l: "ID / EMAIL", v: booking.attendeeEmail },
      { l: "PURCHASED AT", v: booking.purchasedAt },
      { l: "STATUS", v: booking.status === "checkedin" ? "ADMITTED" : "AUTHORIZED" },
      ...(booking.checkedInBy ? [{ l: "CLEARED BY", v: booking.checkedInBy }] : [])
    ];

    let ry = 60;
    rightInfo.forEach(item => {
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.text(item.l, 175, ry);
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(String(item.v), 175, ry+6);
      ry += 15;
    });

    // QR Code Section
    if (booking.qr) {
       doc.setFillColor(255, 255, 255);
       doc.rect(190, 140, 50, 50, 'F');
       try {
         doc.addImage(booking.qr, 'PNG', 190, 140, 50, 50);
       } catch (e) {
         console.error("QR Error:", e);
       }
       doc.setFontSize(7);
       doc.setTextColor(212, 175, 55);
       doc.text("SCANNABLE GATE KEY", 195, 195);
    }

    // Security Footer
    doc.setFontSize(6);
    doc.setTextColor(50, 50, 50);
    doc.text("SECURITY PROTOCOL: v2.4.1 | Landscape Pass Encryption Standard", 25, 195);

    doc.save(`Ticket_PRO_${booking.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-6 p-4 bg-white/5 rounded-3xl border border-white/5">
         <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-event-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Search your tickets by event, location or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-event-gold outline-none font-bold placeholder:text-gray-800 transition-all text-sm"
            />
         </div>
         <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Filter:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-event-gold outline-none cursor-pointer"
            >
               <option value="All">All Vouchers</option>
               <option value="confirmed">Confirmed</option>
               <option value="Checked In">Checked In</option>
               <option value="pending_payment">Pending</option>
            </select>
         </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-event-gold animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest text-gray-500">Retrieving Secure Passports...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-white/10">
              <Ticket className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Browse our upcoming events to get started and secure your tickets.</p>
            <a href="/" className="btn-primary flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Browse Events</span>
            </a>
          </div>
        ) : filteredBookings.map((booking) => (
          <div key={booking.id} className="glass-card overflow-hidden group">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
              {/* Left Info */}
              <div className="p-8 flex-1 space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded border ${
                        booking.status === 'Checked In' ? 'bg-green-500/20 text-green-500 border-green-500/40' :
                        booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {booking.status === 'Checked In' ? 'Admission Authorized' : 
                         booking.status === 'confirmed' ? 'Payment Verified' : 'Awaiting MoMo'}
                      </span>
                      <h2 className="text-2xl font-bold mt-3 group-hover:text-event-gold transition-colors">{booking.event}</h2>
                    </div>
                    <p className="text-xs font-medium text-[var(--text-secondary)]">Ref: {booking.id}</p>
                 </div>

                 <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-event-gold" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] font-bold">
                      <Ticket className="w-4 h-4 text-event-gold" />
                      <span>{booking.seats.join(', ')}</span>
                    </div>
                 </div>
                 
                 {booking.purchasedAt && (
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Transaction Security:</span>
                        <span className="text-[10px] font-bold text-event-gold">{booking.purchasedAt}</span>
                      </div>
                      
                      {booking.checkedInBy && (
                        <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                           <ShieldCheck className="w-3 h-3 text-green-500" />
                           <span className="text-[10px] font-black text-green-500 uppercase">Cleared by: {booking.checkedInBy}</span>
                        </div>
                      )}
                   </div>
                 )}
              </div>

              {/* Right Actions */}
              <div className="p-8 md:w-80 bg-white/[0.02] flex flex-col justify-between space-y-6">
                 <div className="flex justify-between items-center">
                    <p className="text-xs text-[var(--text-secondary)] font-bold uppercase">Total Paid</p>
                    <p className="text-xl font-black text-event-gold">{booking.price}</p>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    {booking.status === 'confirmed' ? (
                      <button 
                        onClick={() => setShowQR(booking)}
                        className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View QR Ticket</span>
                      </button>
                    ) : (
                      <button className="glass-button w-full flex items-center justify-center space-x-2 py-3 border-yellow-500/20 text-yellow-500">
                        <span>Retry Payment</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDownloadPDF(booking)}
                      className="glass-button w-full flex items-center justify-center space-x-2 py-3"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF Receipt</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-black text-center relative"
             >
                <button onClick={() => setShowQR(null)} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
                
                <div className="mb-8">
                  <div className="w-16 h-16 bg-event-gold rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
                     <Ticket className="w-8 h-8 text-black -rotate-12" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">Rwanda EventHub</h3>
                </div>

                <div className="bg-gray-100 p-6 rounded-3xl mb-8">
                   <img src={showQR.qr} alt="QR Code" className="w-full aspect-square mix-blend-multiply" />
                   <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scannable Guest ID</p>
                      <p className="font-mono text-sm tracking-widest mt-1">{showQR.id}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                      <p className="text-lg font-black">{showQR.event}</p>
                      <p className="text-xs font-bold text-gray-500">{showQR.seats.join(' + ')}</p>
                   </div>
                   <div className="flex space-x-3">
                      <button className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">
                        <Printer className="w-4 h-4" />
                        <span>Print Hub</span>
                      </button>
                      <button className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                   </div>
                </div>
                
                <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
                  Present this QR code at the {showQR.location} for instant venue entry.
                </p>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
