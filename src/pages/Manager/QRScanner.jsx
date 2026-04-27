import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Camera, CheckCircle2, XCircle, Users, Layout, Smartphone, ChevronRight, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../../components/Common/AuthContext';
import { verifyApi, staffApi } from '../../services/api';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = () => {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // 'valid', 'invalid', 'already', 'wrong_event'
  const [scannedData, setScannedData] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({ total: 0, recent: [] });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchLogs(), fetchAssignments()]);
      setLoading(false);
    };
    init();

    return () => {
        stopScanner();
    };
  }, [user.id]);

  // Start scanner when not in result state
  useEffect(() => {
    if (!result && !loading && !scanning) {
        startScanner();
    } else {
        stopScanner();
    }
  }, [result, loading, scanning]);

  const startScanner = async () => {
    try {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader");
        }
        
        await scannerRef.current.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                processScan(decodedText);
            },
            () => {} // Ignore errors
        );
    } catch (err) {
        console.error("Scanner failed to start:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
        try {
            await scannerRef.current.stop();
        } catch (err) {
            console.error("Failed to stop scanner:", err);
        }
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await staffApi.getStaffAssignments(user.id);
      setAssignments(data || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  }

  const fetchLogs = async () => {
    try {
      const logs = await verifyApi.getRecentLogs(user.id);
      setStats({
        total: logs.filter(l => l.result === 'Valid').length,
        recent: logs.slice(0, 5)
      });
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const processScan = async (qrValue) => {
    if (!qrValue) return;
    setScanning(true);
    setResult(null);
    setErrorMsg('');
    stopScanner(); // Stop camera during processing

    try {
      const log = await verifyApi.verifyTicket(qrValue, user.id);
      
      setScannedData({
        name: log.booking?.user?.fullName || 'Verified Guest',
        id: log.bookingId,
        seat: log.booking?.seat?.seatNumber || 'Assigned Seat',
        event: log.event?.title
      });
      setResult('valid');
      fetchLogs();
    } catch (err) {
      const msg = err.toString();
      if (msg.includes("already")) setResult('already');
      else if (msg.includes("authorized")) setResult('wrong_event');
      else setResult('invalid');
      setErrorMsg(msg);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center text-center md:text-left flex-col md:flex-row gap-6">
        <div>
          <span className="text-[10px] font-black text-event-gold uppercase tracking-[0.3em] border border-event-gold/30 bg-event-gold/10 px-3 py-1.5 rounded-full inline-block mb-4 shadow-lg shadow-event-gold/10">
            Scanner Identity: {user?.id} | {user?.fullName}
          </span>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Tactical QR Scanner</h1>
          <p className="text-[var(--text-secondary)] font-medium">Verify guest credentials and authorize venue admission.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-2xl">
            <Users className="w-6 h-6 text-event-gold" />
            <div>
               <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Scanned (Your Shift)</p>
               <p className="text-2xl font-black">{stats.total}</p>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Scanner Viewport */}
        <div className="glass-card overflow-hidden relative aspect-square bg-black group border-white/5">
            {!result && !scanning && (
                <div id="reader" className="w-full h-full"></div>
            )}
            
            {!result && !scanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="relative w-64 h-64 border-2 border-event-gold/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-event-gold shadow-[0_0_15px_#D4AF37] animate-scan z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-event-gold/5 via-transparent to-event-gold/5" />
                    </div>
                </div>
            )}

            <AnimatePresence>
                {result === 'valid' && scannedData && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 1.1 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="absolute inset-0 bg-[#00C853] flex flex-col items-center justify-center p-10 text-center"
                    >
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                           <CheckCircle2 className="w-24 h-24 text-white mb-6" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">ACCESS GRANTED</h2>
                        <div className="mt-6 pt-6 border-t border-white/20 w-full space-y-2">
                            <p className="text-xs font-black text-white/60 uppercase tracking-widest">Verified Guest</p>
                            <p className="text-2xl font-black text-white uppercase">{scannedData.name}</p>
                            <p className="text-sm font-bold text-white bg-black/20 py-2 rounded-xl mt-2">{scannedData.event}</p>
                            <p className="text-sm font-bold text-white border border-white/20 py-2 rounded-xl mt-1">SEAT: {scannedData.seat}</p>
                        </div>
                        <button onClick={() => setResult(null)} className="mt-10 w-full py-4 bg-white text-green-600 font-black uppercase tracking-widest rounded-2xl shadow-2xl active:scale-95 transition-all">NEXT SCAN</button>
                    </motion.div>
                )}

                {(result === 'invalid' || result === 'already' || result === 'wrong_event') && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className={`absolute inset-0 flex flex-col items-center justify-center p-10 text-center ${
                           result === 'already' ? 'bg-[#FFD600]' : 
                           result === 'wrong_event' ? 'bg-[#FF6D00]' : 'bg-[#D50000]'
                        }`}
                    >
                        <XCircle className={`w-24 h-24 mb-6 ${result === 'already' ? 'text-black' : 'text-white'}`} />
                        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${result === 'already' ? 'text-black' : 'text-white'}`}>
                           {result === 'already' ? 'DUPLICATE' : result === 'wrong_event' ? 'WRONG VENUE' : 'INVALID'}
                        </h2>
                        <p className={`mt-4 font-bold leading-relaxed ${result === 'already' ? 'text-black' : 'text-white/80'}`}>
                           {errorMsg || 'No matching booking record found.'}
                        </p>
                        <button onClick={() => setResult(null)} className={`mt-10 w-full py-4 font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all ${
                            result === 'already' ? 'bg-black text-white' : 'bg-white text-red-600'
                        }`}>DISMISS</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {scanning && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-md z-20">
                    <Loader2 className="w-16 h-16 border-event-gold text-event-gold animate-spin mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-event-gold">Verifying Credentials...</p>
                </div>
            )}
        </div>

        {/* Manual Input & History */}
        <div className="space-y-8">
            <div className="glass-card p-8 border-event-gold/20 bg-event-gold/[0.02]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                   <Layout className="w-5 h-5 text-event-gold" />
                   <span>Assigned Operation Zones</span>
                </h3>
                <div className="space-y-3">
                    {assignments.map((as, i) => (
                      <div key={i} className="flex flex-col p-4 bg-black/40 border border-white/5 rounded-2xl">
                         <p className="text-xs font-black text-event-gold uppercase">{as.event?.title}</p>
                         <div className="flex items-center gap-2 mt-2 opacity-60">
                            <ChevronRight className="w-3 h-3 text-white" />
                            <p className="text-[10px] font-bold text-white uppercase">{as.event?.venue?.name || 'Authorized Zone'}</p>
                         </div>
                      </div>
                    ))}
                    {assignments.length === 0 && (
                      <p className="text-xs text-secondary-text opacity-50 italic">No active tactical assignments found.</p>
                    )}
                </div>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                   <Smartphone className="w-5 h-5 text-event-gold" />
                   <span>Manual ID Validation</span>
                </h3>
                <div className="space-y-4">
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                       <input 
                         type="text" 
                         placeholder="Paste Booking ID (e.g. 1024)..."
                         value={manualCode}
                         onChange={(e) => setManualCode(e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-event-gold outline-none font-bold"
                       />
                    </div>
                    <button 
                      onClick={() => processScan(manualCode)}
                      disabled={scanning || !manualCode}
                      className="w-full btn-primary py-4 text-xs font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      Verify Operation
                    </button>
                </div>
            </div>

            <div className="glass-card p-8 bg-white/[0.01]">
                <h3 className="text-lg font-bold mb-6">Real-Time Shift Logs</h3>
                <div className="space-y-4">
                    {stats.recent.map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                         <div className="flex items-center gap-4">
                            {log.result === 'Valid' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                            <div>
                               <p className="text-sm font-bold">{log.booking?.user?.fullName || 'Unknown'}</p>
                               <p className="text-[10px] text-gray-500 font-black uppercase">ID: {log.bookingId} • {new Date(log.scannedAt).toLocaleTimeString()}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                    {stats.recent.length === 0 && (
                      <p className="text-center py-6 text-xs text-gray-600 italic">No scans recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
