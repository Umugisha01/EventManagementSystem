import React from 'react';
import { Building2, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const VENUES = [
  {
    name: 'Kigali Convention Centre',
    location: 'Kigali',
    capacity: '4,500',
    status: 'Available',
  },
  {
    name: 'Intare Conference Arena',
    location: 'Kigali',
    capacity: '2,800',
    status: 'Booked',
  },
  {
    name: 'Kigali Heights',
    location: 'Kigali',
    capacity: '1,900',
    status: 'Available',
  },
];

const Venues = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Venues</h1>
        <p className="text-gray-400">Manage your venue availability, capacity, and booking status.</p>
      </div>
      <button className="btn-primary">Add New Venue</button>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {VENUES.map((venue) => (
        <div key={venue.name} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{venue.name}</h2>
              <p className="text-gray-400">{venue.location}</p>
            </div>
            <Building2 className="w-6 h-6 text-event-gold" />
          </div>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Capacity: <span className="text-white font-semibold">{venue.capacity}</span></p>
            <p>Status: <span className={`font-semibold ${venue.status === 'Available' ? 'text-green-400' : 'text-red-400'}`}>{venue.status}</span></p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>City Center</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>
          <button className="glass-button w-full">View details</button>
        </div>
      ))}
    </div>
  </div>
);

export default Venues;
