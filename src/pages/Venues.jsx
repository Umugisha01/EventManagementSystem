import React, { useState } from 'react';
import { Building2, MapPin, Clock, Plus, X } from 'lucide-react';

const INITIAL_VENUES = [
  {
    name: 'Kigali Convention Centre',
    location: 'Kigali',
    area: 'City Center',
    capacity: '4,500',
    status: 'Available',
    support: '24/7 Support',
    description: 'Indoor conference venue with flexible seating, high-speed WiFi, and premium catering services.',
    facilities: 'WiFi, Parking, Catering, AV Equipment',
    contact: 'events@kigalicc.rw',
  },
  {
    name: 'Intare Conference Arena',
    location: 'Kigali',
    area: 'City Center',
    capacity: '2,800',
    status: 'Booked',
    support: 'Event Manager Onsite',
    description: 'Large arena suitable for concerts, ceremonies, and large group events with dedicated logistics support.',
    facilities: 'Stage, Lighting, Sound System, VIP Lounge',
    contact: 'info@intarearena.rw',
  },
  {
    name: 'Kigali Heights',
    location: 'Kigali',
    area: 'City Center',
    capacity: '1,900',
    status: 'Available',
    support: '24/7 Support',
    description: 'Modern venue with rooftop views, meeting rooms, and event planning support for medium-sized gatherings.',
    facilities: 'WiFi, Projector, Lounge Area, Catering',
    contact: 'hello@kigaliheights.rw',
  },
];

const Venues = () => {
  const [venueList, setVenueList] = useState(INITIAL_VENUES);
  const [showNewVenueModal, setShowNewVenueModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueForm, setVenueForm] = useState({
    name: '',
    location: '',
    area: '',
    capacity: '',
    status: 'Available',
    support: '24/7 Support',
    description: '',
    facilities: '',
    contact: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenueForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVenue = {
      ...venueForm,
      capacity: venueForm.capacity.toString(),
    };

    setVenueList((prev) => [newVenue, ...prev]);
    setVenueForm({
      name: '',
      location: '',
      area: '',
      capacity: '',
      status: 'Available',
      support: '24/7 Support',
      description: '',
      facilities: '',
      contact: '',
    });
    setShowNewVenueModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Venues</h1>
          <p className="text-gray-400">Manage your venue availability, capacity, and booking status.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2" onClick={() => setShowNewVenueModal(true)}>
          <Plus className="w-4 h-4" />
          <span>Add New Venue</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {venueList.map((venue, index) => (
          <div key={`${venue.name}-${index}`} className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{venue.name}</h2>
                <p className="text-gray-400">{venue.location}</p>
              </div>
              <Building2 className="w-6 h-6 text-event-gold" />
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                Capacity: <span className="text-white font-semibold">{venue.capacity}</span>
              </p>
              <p>
                Status:{' '}
                <span className={`font-semibold ${venue.status === 'Available' ? 'text-green-400' : 'text-red-400'}`}>
                  {venue.status}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{venue.area || 'City Center'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{venue.support || '24/7 Support'}</span>
              </div>
            </div>

            <button className="glass-button w-full" onClick={() => setSelectedVenue(venue)}>
              View details
            </button>
          </div>
        ))}
      </div>

      {showNewVenueModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Add New Venue</h2>
              <button onClick={() => setShowNewVenueModal(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Venue Name</label>
                  <input
                    type="text"
                    name="name"
                    value={venueForm.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="location"
                    value={venueForm.location}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Enter city or region"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={venueForm.area}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="e.g. City Center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={venueForm.capacity}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Maximum capacity"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={venueForm.status}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Support</label>
                  <input
                    type="text"
                    name="support"
                    value={venueForm.support}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="e.g. 24/7 Support"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={venueForm.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold resize-none"
                  placeholder="Describe the venue facilities and features..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Facilities (comma-separated)</label>
                <input
                  type="text"
                  name="facilities"
                  value={venueForm.facilities}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="e.g., WiFi, Parking, Catering, AV Equipment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Information</label>
                <input
                  type="text"
                  name="contact"
                  value={venueForm.contact}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="Phone number or email"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowNewVenueModal(false)} className="glass-button">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedVenue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold">{selectedVenue.name}</h2>
                <p className="text-gray-400">{selectedVenue.location}</p>
              </div>
              <button onClick={() => setSelectedVenue(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-400">Area</p>
                  <p className="text-white font-semibold">{selectedVenue.area || 'City Center'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Capacity</p>
                  <p className="text-white font-semibold">{selectedVenue.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`font-semibold ${selectedVenue.status === 'Available' ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedVenue.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Support</p>
                  <p className="text-white font-semibold">{selectedVenue.support}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-white leading-relaxed">{selectedVenue.description || 'No description provided.'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Facilities</p>
                <p className="text-white leading-relaxed">{selectedVenue.facilities || 'No facilities listed.'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Contact</p>
                <p className="text-white leading-relaxed">{selectedVenue.contact || 'No contact information provided.'}</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button type="button" onClick={() => setSelectedVenue(null)} className="btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;
