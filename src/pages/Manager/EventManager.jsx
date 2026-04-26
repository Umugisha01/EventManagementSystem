import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  Plus, 
  Save, 
  Sparkles, 
  Tag, 
  Upload, 
  Image as ImageIcon, 
  X,
  Type,
  ChevronRight,
  Info,
  Gem,
  Layout
} from 'lucide-react';
import { eventsApi, venuesApi, usersApi } from '../../services/api';

const EventManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingEvent = location.state?.editEvent;

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [managers, setManagers] = useState([]);
  const [venueSeats, setVenueSeats] = useState([]);
  
  const [imagePreview, setImagePreview] = useState(editingEvent?.imageUrl || null);
  const [error, setError] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  
  const [formData, setFormData] = useState({
    title: editingEvent?.title || '',
    category: editingEvent?.category || 'Technology',
    venueId: editingEvent?.venueId || '',
    managerId: editingEvent?.managerId || '',
    imageUrl: editingEvent?.imageUrl || '',
    description: editingEvent?.description || '',
    startDate: editingEvent?.startDate ? new Date(editingEvent.startDate).toISOString().split('T')[0] : '',
    startTime: editingEvent?.startDate ? new Date(editingEvent.startDate).toTimeString().slice(0, 5) : '',
    endDate: editingEvent?.endDate ? new Date(editingEvent.endDate).toISOString().split('T')[0] : '',
    endTime: editingEvent?.endDate ? new Date(editingEvent.endDate).toTimeString().slice(0, 5) : '',
  });

  const [pricingTiers, setPricingTiers] = useState(editingEvent?.pricingTiers || []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.venueId) {
      fetchVenueSeats(formData.venueId);
    }
  }, [formData.venueId]);

  const fetchInitialData = async () => {
    try {
      const [venuesData, usersData] = await Promise.all([
        venuesApi.getVenues(),
        usersApi.getUsers()
      ]);
      setVenues(venuesData || []);
      setManagers((usersData || []).filter(u => u.role.toLowerCase() === 'manager' || u.role.toLowerCase() === 'admin'));
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const fetchVenueSeats = async (id) => {
    if (!id) return;
    try {
      const venueData = await venuesApi.getVenue(id);
      if (venueData && venueData.seats && venueData.seats.length > 0) {
        // Group seats by Class to get unique categories
        const classes = [...new Set(venueData.seats.map(s => s.class || 'Regular'))];
        
        // Populate tiers based on the actual physical seats found in the Excel map
        const newTiers = classes.map(cls => {
          const physicalCount = venueData.seats.filter(s => s.class === cls).length;
          
          // If we are editing, try to find existing price for this class
          const existingTier = editingEvent?.pricingTiers?.find(t => t.seatClass === cls);
          
          return {
            seatClass: cls,
            price: existingTier?.price || 0,
            totalCapacity: existingTier?.totalCapacity || physicalCount,
            physicalLimit: physicalCount // Keep track of the absolute maximum
          };
        });
        setPricingTiers(newTiers);
      } else {
        setPricingTiers([]); // No seats found
      }
    } catch (err) {
      console.error('Failed to fetch venue seats:', err);
      setError('Could not load seat mapping for this venue. Ensure you have imported an Excel map in Venue Manager.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    setError('');
    if (activeStep === 1) {
      if (!formData.title || !formData.venueId || !formData.startDate || !formData.startTime) {
        setError('Please fill in essential information.');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };
  
  const handlePublish = async () => {
    setLoading(true);
    setError('');
    try {
      // Validate pricing
      if (pricingTiers.some(t => t.price < 0)) {
        throw new Error('Pricing cannot be negative.');
      }

      const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
      
      const payload = {
        ...formData,
        category: finalCategory,
        startDate: `${formData.startDate}T${formData.startTime}:00`,
        endDate: `${formData.endDate}T${formData.endTime}:00`,
        imageUrl: imagePreview || formData.imageUrl,
        pricingTiers: pricingTiers.map(t => ({
          seatClass: t.seatClass,
          price: parseFloat(t.price),
          totalCapacity: parseInt(t.totalCapacity)
        }))
      };

      if (editingEvent) {
        await eventsApi.updateEvent(editingEvent.id, payload);
        alert('Event updated successfully!');
      } else {
        await eventsApi.createEvent(payload);
        alert('Event created successfully!');
      }
      navigate('/dashboard/events');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...pricingTiers];
    newTiers[index][field] = value;
    setPricingTiers(newTiers);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{editingEvent ? 'Edit' : 'Create'} Event</h1>
          <p className="text-[var(--text-secondary)]">Manage your event details, location and pricing strategy.</p>
        </div>
        <button onClick={() => navigate('/dashboard/events')} className="glass-button flex items-center space-x-2">
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2].map(step => (
          <React.Fragment key={step}>
            <div className={`flex items-center space-x-3 ${activeStep === step ? 'text-event-gold' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${activeStep === step ? 'border-event-gold bg-event-gold/10' : 'border-gray-700'}`}>
                {step}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">{step === 1 ? 'Details' : 'Pricing'}</span>
            </div>
            {step === 1 && <div className="w-12 h-px bg-gray-700" />}
          </React.Fragment>
        ))}
      </div>

      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-event-gold/5 -rotate-45 translate-x-32 -translate-y-32 blur-3xl pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] font-black mb-3">Event Identity</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-4 text-xl font-bold focus:border-event-gold outline-none transition-all" 
                    placeholder="Enter event name..."
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] font-black mb-3">Target Category</label>
                  <div className="space-y-3">
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none"
                    >
                      <option>Technology</option>
                      <option>Agriculture</option>
                      <option>Creative Hub</option>
                      <option>Tourism & Gala</option>
                      <option>Sports</option>
                      <option>Music & Concerts</option>
                      <option>Other</option>
                    </select>
                    {formData.category === 'Other' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <input 
                          type="text" 
                          placeholder="Type category name..."
                          value={customCategory}
                          onChange={e => setCustomCategory(e.target.value)}
                          className="w-full bg-white/5 border border-event-gold/50 rounded-xl px-4 py-3 focus:border-event-gold outline-none text-sm italic"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] font-black mb-3">Strategic Venue</label>
                  <select 
                    value={formData.venueId}
                    onChange={e => setFormData({...formData, venueId: e.target.value})}
                    className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none"
                  >
                    <option value="">-- Select Location --</option>
                    {venues.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] font-black mb-3">Event Brief / Description</label>
                  <textarea 
                    rows="4"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-4 focus:border-event-gold outline-none resize-none" 
                    placeholder="Tell us more about the event scope..."
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                   <label className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] font-black mb-3">Visual Cover</label>
                   <div 
                      className="h-40 rounded-2xl border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center bg-white/5 hover:border-event-gold transition-all cursor-pointer overflow-hidden relative group"
                      onClick={() => document.getElementById('poster-upload').click()}
                   >
                     {imagePreview ? (
                       <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                     ) : (
                       <>
                        <ImageIcon className="w-8 h-8 text-gray-600 mb-2" />
                        <span className="text-xs font-bold text-gray-500 underline">Upload Image</span>
                       </>
                     )}
                     <input type="file" id="poster-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                   </div>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-[var(--text-secondary)] font-black">Assign Manager</label>
                  <select 
                    value={formData.managerId}
                    onChange={e => setFormData({...formData, managerId: e.target.value})}
                    className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none"
                  >
                    <option value="">-- Publish Directly (No Manager) --</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.fullName} ({m.userName})</option>
                    ))}
                  </select>
                  <div className="p-3 bg-event-gold/5 rounded-xl border border-event-gold/10 flex items-start space-x-3">
                    <Info className="w-4 h-4 text-event-gold shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[var(--text-secondary)]">Managers assigned will have full control over staff and check-ins for this event.</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 rounded-2xl border border-[var(--border-color)]">
                    <TimelineField label="Start Date" type="date" value={formData.startDate} onChange={v => setFormData({...formData, startDate: v})} />
                    <TimelineField label="Time" type="time" value={formData.startTime} onChange={v => setFormData({...formData, startTime: v})} />
                    <TimelineField label="End Date" type="date" value={formData.endDate} onChange={v => setFormData({...formData, endDate: v})} />
                    <TimelineField label="Time" type="time" value={formData.endTime} onChange={v => setFormData({...formData, endTime: v})} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center">
                    <Ticket className="w-6 h-6 mr-3 text-event-gold" />
                    <span>Seating Tiers & Pricing</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">These classes are automatically synchronized with your venue's seat map.</p>
                </div>
              </div>

              <div className="space-y-4">
                {pricingTiers.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-[var(--border-color)] rounded-3xl bg-white/5">
                    <Layout className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)] font-bold">No Seat Map Detected</p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto mt-2">
                       This venue doesn't have a seat map yet. Go to <span className="text-event-gold cursor-pointer hover:underline" onClick={() => navigate('/dashboard/venues')}>Venue Manager</span> to upload an Excel file.
                    </p>
                  </div>
                ) : pricingTiers.map((tier, idx) => (
                  <div key={idx} className="relative p-6 bg-white/5 border border-[var(--border-color)] rounded-3xl group hover:border-event-gold/50 transition-all overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-event-gold" />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="p-2 bg-event-gold/10 rounded-xl">
                            <Gem className="w-5 h-5 text-event-gold" />
                          </div>
                          <span className="font-black text-xl tracking-tight">{tier.seatClass}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-[10px] uppercase font-black tracking-widest text-[#10b981]">Physical Capacity: {tier.physicalLimit}</span>
                          <span className="w-1 h-1 bg-gray-700 rounded-full" />
                          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Auto-Synced</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase text-gray-500 ml-2">Sale Price (RWF)</label>
                           <div className="relative">
                              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-event-gold" />
                              <input 
                                 type="number" 
                                 value={tier.price}
                                 onChange={e => updateTier(idx, 'price', e.target.value)}
                                 className="bg-black/60 border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 focus:border-event-gold outline-none font-bold w-44" 
                                 placeholder="e.g. 50000" 
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase text-gray-500 ml-2">Ticket Limit</label>
                           <div className="relative">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input 
                                 type="number" 
                                 value={tier.totalCapacity}
                                 max={tier.physicalLimit}
                                 onChange={e => updateTier(idx, 'totalCapacity', e.target.value)}
                                 className="bg-black/60 border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 focus:border-event-gold outline-none font-bold w-36" 
                                 placeholder="Limit" 
                              />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-event-gold/5 border border-event-gold/20 rounded-2xl flex items-start space-x-3">
                <Info className="w-5 h-5 text-event-gold shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <strong>Smart Validation:</strong> Ensure your total event capacity ({pricingTiers.reduce((acc, t) => acc + parseInt(t.totalCapacity || 0), 0)}) does not exceed the physical limits of the venue.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl flex items-center space-x-3">
             <AlertCircle className="w-5 h-5" />
             <span>{error}</span>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-[var(--border-color)] flex space-x-4">
          {activeStep > 1 && (
            <button onClick={() => setActiveStep(1)} className="flex-1 glass-button py-4">Back to Details</button>
          )}
          {activeStep === 1 ? (
            <button onClick={nextStep} className="flex-1 btn-primary py-4 flex items-center justify-center space-x-2">
              <span>Next: Pricing Strategy</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
                onClick={handlePublish} 
                disabled={loading}
                className="flex-[2] btn-primary py-4 flex items-center justify-center space-x-2"
            >
              {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
              <span>{editingEvent ? 'Update Event' : 'Create & Publish'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineField = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-black mb-1">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border-b border-[var(--border-color)] py-2 focus:border-event-gold outline-none text-xs font-bold" 
    />
  </div>
);

const AlertCircle = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

export default EventManager;
