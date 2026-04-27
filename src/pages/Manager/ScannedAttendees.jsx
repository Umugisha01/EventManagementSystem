import React, { useState, useEffect } from 'react';
import { Search, History, Download, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../../components/Common/AuthContext';
import { verifyApi } from '../../services/api';

const ScannedAttendees = () => {
  const { user } = useAuth();
  const [scannedList, setScannedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await verifyApi.getRecentLogs(user.id);
        setScannedList(logs);
      } catch (err) {
        console.error("Failed to fetch scan logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user.id]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-event-gold uppercase tracking-widest border border-event-gold/30 bg-event-gold/10 px-2 py-1 rounded inline-block mb-3">
            Scanner Shift: {user?.fullName}
          </span>
          <h1 className="text-3xl font-bold">Scanned Tickets Log</h1>
          <p className="text-[var(--text-secondary)]">Complete history of all tickets validated through your terminal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase">Total Scans</p>
            <p className="text-3xl font-black mt-2">{scannedList.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase">Valid Entries</p>
            <p className="text-3xl font-black text-green-500 mt-2">{scannedList.filter(s => s.result === 'Valid').length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center border border-red-500/20 bg-red-500/5">
            <p className="text-sm font-bold text-red-500/60 uppercase">Security Alerts</p>
            <p className="text-3xl font-black text-red-500 mt-2">{scannedList.filter(s => s.result !== 'Valid').length}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center space-x-2 bg-white/5">
            <History className="w-4 h-4 text-event-gold" />
            <span className="font-bold text-sm tracking-wide">SECURE SYSTEM LOGS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-[var(--border-color)]">
              <tr>
                <th className="p-4 font-bold text-sm">Time</th>
                <th className="p-4 font-bold text-sm">Booking ID</th>
                <th className="p-4 font-bold text-sm">Attendee</th>
                <th className="p-4 font-bold text-sm">Event & Seat</th>
                <th className="p-4 font-bold text-sm">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-event-gold animate-spin mx-auto" />
                  </td>
                </tr>
              ) : scannedList.map((log, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-mono text-[var(--text-secondary)]">{new Date(log.scannedAt).toLocaleTimeString()}</td>
                  <td className="p-4 text-sm font-mono text-gray-400">#{log.bookingId}</td>
                  <td className="p-4 font-bold">
                    {log.booking?.user?.fullName || 'Registry Guest'}
                    <p className="text-[10px] text-gray-500 font-normal">{log.booking?.user?.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold">{log.event?.title || 'Unknown Event'}</p>
                    <p className="text-[10px] text-event-gold uppercase font-black">{log.booking?.seat?.seatNumber}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-1 rounded border font-black uppercase tracking-widest ${
                      log.result === 'Valid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && scannedList.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-white/10">
                      <History className="w-8 h-8 text-[var(--text-secondary)]" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">No scanned tickets</h3>
                    <p className="text-sm text-[var(--text-secondary)]">You haven't scanned any tickets yet today.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScannedAttendees;
