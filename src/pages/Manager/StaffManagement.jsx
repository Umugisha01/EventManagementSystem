import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserPlus, Trash2, Calendar, Loader2, Key, Search } from 'lucide-react';
import { useAuth } from '../../components/Common/AuthContext';
import { eventsApi, staffApi, usersApi } from '../../services/api';

const StaffManagement = () => {
  const { user } = useAuth();
  const [managerEvents, setManagerEvents] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeployment, setNewDeployment] = useState({ staffId: '', eventId: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('All');

  useEffect(() => {
    fetchInitialData();
  }, [user.username]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Manager's Events
      const allEvents = await eventsApi.getEvents();
      const myEvents = allEvents.filter(e => e.manager?.userName === user.username);
      setManagerEvents(myEvents);

      // 2. Fetch All System Staff Users
      const allUsers = await usersApi.getUsers();
      const staffUsers = allUsers.filter(u => u.role === 'Staff');
      setAvailableStaff(staffUsers);

      // 3. Fetch Deployments for each event
      const deploymentPromises = myEvents.map(e => staffApi.getEventStaff(e.id));
      const results = await Promise.all(deploymentPromises);
      const combined = results.flatMap(res => res || []);
      setDeployments(combined);

      if (myEvents.length > 0) {
        setNewDeployment(prev => ({ ...prev, eventId: myEvents[0].id }));
      }
      if (staffUsers.length > 0) {
        setNewDeployment(prev => ({ ...prev, staffId: staffUsers[0].id }));
      }
    } catch (err) {
      console.error('Data sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!newDeployment.staffId || !newDeployment.eventId) return;

    try {
      await staffApi.assignStaff({
        staffId: parseInt(newDeployment.staffId),
        eventId: parseInt(newDeployment.eventId),
        isActive: true
      });
      alert('Operative Deployed Successfully!');
      setShowAddModal(false);
      fetchInitialData();
    } catch (err) {
      setErrorMsg(err.toString());
    }
  };

  const handleDecommission = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this deployment?')) return;
    try {
      await staffApi.removeStaff(id);
      fetchInitialData();
    } catch (err) {
      alert(err.toString());
    }
  };

  const filteredDeployments = deployments.filter(d => {
    const matchSearch = d.staff?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        d.staff?.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEvent = d.event?.title === eventFilter || eventFilter === 'All';
    return matchSearch && matchEvent;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Staff Deployment</h1>
           <p className="text-[var(--text-secondary)] font-medium">Strategic mobilization of scanning units for your authorized sectors.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-3 px-8 py-4 shadow-xl shadow-event-gold/20"
        >
          <UserPlus className="w-5 h-5 text-black" />
          <span className="font-black uppercase tracking-widest text-xs text-black">Commission Staff</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
          <div className="relative flex-1 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-event-gold transition-colors" />
             <input 
               type="text" 
               placeholder="Search operatives by name or ID handle..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-16 pr-6 focus:border-event-gold outline-none font-bold placeholder:text-gray-800 transition-all text-sm"
             />
          </div>
          <div className="flex items-center space-x-3">
             <span className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] whitespace-nowrap">Filter Sector:</span>
             <select 
               value={eventFilter}
               onChange={(e) => setEventFilter(e.target.value)}
               className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-event-gold outline-none cursor-pointer"
             >
                <option value="All">Full Force</option>
                {managerEvents.map(e => (
                   <option key={e.id} value={e.title}>{e.title}</option>
                ))}
             </select>
          </div>
      </div>

      <div className="glass-card overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-500">Operative Identity</th>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-500">Assigned Sector</th>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-500">Deployment Status</th>
              <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                 <td colSpan="4" className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-event-gold mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Syncing with Tactical Database...</p>
                 </td>
              </tr>
            ) : filteredDeployments.map((deployment) => (
              <tr key={deployment.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-event-gold/10 flex items-center justify-center border border-event-gold/20">
                         <span className="text-event-gold font-black">{deployment.staff?.fullName?.[0] || 'S'}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-gray-200">{deployment.staff?.fullName}</span>
                         <span className="text-[10px] font-black uppercase text-gray-500 font-mono tracking-tighter">@{deployment.staff?.userName}</span>
                      </div>
                   </div>
                </td>
                <td className="p-6">
                   <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4 text-event-gold" />
                      <span className="text-xs font-bold">{deployment.event?.title}</span>
                   </div>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center space-x-2 w-max ${deployment.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${deployment.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span>{deployment.isActive ? 'ACTIVE DEPLOYMENT' : 'TERMINATED'}</span>
                  </span>
                </td>
                <td className="p-6 text-right">
                   <button 
                     onClick={() => handleDecommission(deployment.id)} 
                     className="p-3 hover:bg-red-500/10 text-gray-500 hover:text-red-500 border border-white/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                     title="Terminate Assignment"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredDeployments.length === 0 && (
           <div className="p-20 text-center flex flex-col items-center">
              <ShieldCheck className="w-16 h-16 text-gray-800 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active operatives deployed in this sector</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldCheck className="w-32 h-32" />
              </div>

              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Commission Operative</h2>
              <p className="text-sm text-gray-500 mb-10 font-medium">strategic sector assignment for your authorized Rwandan events.</p>
              
              <form onSubmit={handleDeploy} className="space-y-8">
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Target Sector (Your Assigned Events)</label>
                   <select 
                     value={newDeployment.eventId}
                     onChange={(e) => setNewDeployment({...newDeployment, eventId: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-event-gold outline-none appearance-none font-bold text-gray-300"
                   >
                     {managerEvents.map(e => (
                       <option key={e.id} value={e.id} className="bg-black">{e.title}</option>
                     ))}
                     {managerEvents.length === 0 && <option value="">NO AUTHORIZED EVENTS FOUND</option>}
                   </select>
                </div>

                <div>
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Operative Personnel (Verified Staff Units)</label>
                   <select 
                     value={newDeployment.staffId}
                     onChange={(e) => setNewDeployment({...newDeployment, staffId: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-event-gold outline-none appearance-none font-bold text-gray-300"
                   >
                     {availableStaff.map(s => (
                       <option key={s.id} value={s.id} className="bg-black">{s.fullName} (@{s.userName})</option>
                     ))}
                     {availableStaff.length === 0 && <option value="">NO VERIFIED STAFF DETECTED</option>}
                   </select>
                </div>

                {errorMsg && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{errorMsg}</p>}
                
                <div className="flex space-x-4 pt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 glass-button font-black uppercase text-[10px] tracking-widest">Abort</button>
                  <button type="submit" disabled={managerEvents.length === 0 || availableStaff.length === 0} className="flex-1 py-5 btn-primary text-black font-black uppercase text-[10px] tracking-widest disabled:opacity-30">Deploy Assignment</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffManagement;
