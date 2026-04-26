import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Plus, 
  Monitor, 
  Layout, 
  FileSpreadsheet, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  AlertCircle, 
  X,
  Trash2,
  Edit2,
  Download,
  UploadCloud,
  Layers,
  Search,
  Gem
} from 'lucide-react';
import { venuesApi } from '../../services/api';

const VenueManager = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const [importing, setImporting] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: 0,
    type: 'Physical'
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const data = await venuesApi.getVenues();
      setVenues(data || []);
    } catch (err) {
      console.error('Failed to fetch venues:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedVenue(null);
    setFormData({ name: '', address: '', capacity: 0, type: 'Physical' });
    setShowAddModal(true);
  };

  const openEditModal = (venue) => {
    setIsEditing(true);
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity,
      type: venue.type
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await venuesApi.updateVenue(selectedVenue.id, formData);
        alert('Venue updated successfully!');
      } else {
        await venuesApi.createVenue(formData);
        alert('Venue created successfully!');
      }
      setShowAddModal(false);
      fetchVenues();
    } catch (err) {
      alert(err.toString());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue? This will remove all associated seats!')) return;
    try {
      await venuesApi.deleteVenue(id);
      setVenues(venues.filter(v => v.id !== id));
    } catch (err) {
      alert(err.toString());
    }
  };

  const handleFileUpload = async (e, venueId) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setImporting(venueId);
    try {
      const result = await venuesApi.importSeats(venueId, uploadData);
      alert(`Success! ${result.data} seats imported for your venue.`);
      fetchVenues();
    } catch (err) {
      alert('Import failed: ' + err.toString());
    } finally {
      setImporting(null);
    }
  };

  const filteredVenues = venues.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'All' || v.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Venue & Seat Management</h1>
          <p className="text-[var(--text-secondary)]">Organize your physical spaces and upload custom Excel seat maps.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Register New Venue</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 border-b-0 rounded-b-none flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <Layers className="w-5 h-5 text-event-gold" />
              <span>Registered Locations</span>
            </h2>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Find venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl py-1.5 pl-10 pr-4 text-sm focus:border-event-gold outline-none"
                />
              </div>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest focus:border-event-gold outline-none cursor-pointer"
              >
                 <option value="All">All Types</option>
                 <option value="Physical">Indoor</option>
                 <option value="Outdoor">Outdoor</option>
                 <option value="Virtual">Virtual</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center glass-card">
                <div className="w-10 h-10 border-4 border-event-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">Loading venues...</p>
              </div>
            ) : filteredVenues.map(venue => (
              <div key={venue.id} className="glass-card p-6 group hover:border-event-gold/40 transition-all border-l-4 border-l-event-gold/20 hover:border-l-event-gold">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-event-gold/10 rounded-2xl">
                      <MapPin className="w-6 h-6 text-event-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{venue.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{venue.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEditModal(venue)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-event-gold transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(venue.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-[var(--border-color)]">
                  <StatItem label="Type" value={venue.type} />
                  <StatItem label="Base Capacity" value={venue.capacity} />
                  <StatItem 
                    label="Status" 
                    value={venue.capacity > 0 ? 'READY' : 'SEATS NEEDED'} 
                    color={venue.capacity > 0 ? 'text-green-500' : 'text-event-gold'}
                  />
                  <div className="flex justify-end items-center">
                    <input 
                      type="file" 
                      accept=".xlsx, .xls"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, venue.id)}
                    />
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      disabled={importing === venue.id}
                      className="flex items-center space-x-2 px-4 py-2 bg-event-gold/10 text-event-gold rounded-xl border border-event-gold/20 hover:bg-event-gold hover:text-black transition-all font-bold text-xs"
                    >
                      {importing === venue.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>IMPORT MAPPING</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-event-gold/20">
             <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-event-gold/10 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-event-gold" />
                </div>
                <h2 className="font-bold">Excel Mapping Guide</h2>
             </div>
             
             <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
               For <strong>BK Arena</strong> style venues, please use the following Excel column structure starting from row 2:
             </p>
             
             <div className="space-y-3 mb-8">
               <FormatHelp label="Column A" value="Section (BK Arena Lower, VIP Suite)" />
               <FormatHelp label="Column B" value="Row (A, B, C, etc.)" />
               <FormatHelp label="Column C" value="Seat Number (1, 2, 3...)" />
               <FormatHelp label="Column D" value="Category (VVIP, VIP, CIP, Regular)" />
             </div>

             <div className="p-4 bg-white/5 rounded-2xl border border-[var(--border-color)] mb-6">
                <div className="flex items-center space-x-2 text-event-gold mb-2 font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>CRITICAL NOTE</span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                  Importing a new Excel file will overwrite any existing seat mapping for that specific venue.
                </p>
             </div>

             <button className="w-full flex items-center justify-center space-x-2 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-medium">
               <Download className="w-4 h-4" />
               <span>Example Excel Format</span>
             </button>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-event-gold/5 to-transparent">
             <div className="flex items-center space-x-3 mb-4">
                <Gem className="w-5 h-5 text-event-gold" />
                <h2 className="font-bold text-sm">Venue Intelligence</h2>
             </div>
             <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
               Our system automatically calculates real-time availability and heatmap data based on the seat categories you import. Ensure 'CIP' and 'VIP' categories are labeled exactly to enable premium pricing.
             </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-xl p-8 relative"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-8">
                {isEditing ? 'Update Venue Details' : 'Register New Location'}
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Venue Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none" 
                      placeholder="BK Arena, Kigali" 
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Physical Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none" 
                      placeholder="Kimironko, Kigali, Rwanda" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Venue Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none appearance-none"
                    >
                      <option value="Physical">Physical Indoor</option>
                      <option value="Outdoor">Outdoor Stadium</option>
                      <option value="Virtual">Virtual / Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Manual Capacity</label>
                    <input 
                      type="number" 
                      value={formData.capacity}
                      onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none" 
                      placeholder="10000" 
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 glass-button py-4">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-4">
                    {isEditing ? 'Update Venue' : 'Create Venue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatItem = ({ label, value, color = 'text-white' }) => (
  <div>
    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">{label}</p>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);

const FormatHelp = ({ label, value }) => (
  <div className="flex items-center space-x-3 text-xs">
    <span className="font-bold text-event-gold shrink-0">{label}:</span>
    <span className="text-[var(--text-secondary)]">{value}</span>
  </div>
);

export default VenueManager;
