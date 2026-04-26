import React, { useState, useEffect } from 'react';
import { Search, History, Download, Calendar } from 'lucide-react';
import { useAuth } from '../../components/Common/AuthContext';

const ScannedAttendees = () => {
  const { user } = useAuth();
  
  const [scannedList, setScannedList] = useState([]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-event-gold uppercase tracking-widest border border-event-gold/30 bg-event-gold/10 px-2 py-1 rounded inline-block mb-3">
            Assigned: {user?.assignedEvent || 'Scanner Mode'}
          </span>
          <h1 className="text-3xl font-bold">Scanned Tickets Log</h1>
          <p className="text-[var(--text-secondary)]">Live view of attendees cleared through your scanner station today.</p>
        </div>
        <button className="glass-button flex items-center space-x-2 text-sm">
          <Download className="w-4 h-4" />
          <span>Export Local Log</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase">Total Scans</p>
            <p className="text-3xl font-black mt-2">{scannedList.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase">Valid Entries</p>
            <p className="text-3xl font-black text-green-500 mt-2">{scannedList.filter(s => s.status === 'Valid Entry').length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center border border-red-500/20 bg-red-500/5">
            <p className="text-sm font-bold text-red-500/60 uppercase">Rejected / Invalid</p>
            <p className="text-3xl font-black text-red-500 mt-2">{scannedList.filter(s => s.status !== 'Valid Entry').length}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center space-x-2 bg-white/5">
            <History className="w-4 h-4 text-event-gold" />
            <span className="font-bold text-sm tracking-wide">SCAN HISTORY</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-[var(--border-color)]">
            <tr>
              <th className="p-4 font-bold text-sm">Time</th>
              <th className="p-4 font-bold text-sm">Ticket ID</th>
              <th className="p-4 font-bold text-sm">Attendee Name</th>
              <th className="p-4 font-bold text-sm">Seats Validated</th>
              <th className="p-4 font-bold text-sm">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {scannedList.map((att, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm font-mono text-[var(--text-secondary)]">{att.time}</td>
                <td className="p-4 text-sm font-mono text-gray-400">{att.id}</td>
                <td className="p-4 font-bold">{att.name}</td>
                <td className="p-4 text-sm font-bold text-event-gold">{att.seats}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded border font-bold ${
                    att.status === 'Valid Entry' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {att.status}
                  </span>
                </td>
              </tr>
            ))}
            {scannedList.length === 0 && (
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
  );
};

export default ScannedAttendees;
