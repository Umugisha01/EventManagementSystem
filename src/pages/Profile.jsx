import React from 'react';

const Profile = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-400">Your account details and access settings.</p>
      </div>
      <button className="btn-primary">Save Changes</button>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-xl font-bold">Personal Details</h2>
        <div className="space-y-4 text-sm text-gray-300">
          <label className="block">
            <span className="mb-2 block text-gray-400">Full Name</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-event-gold" defaultValue="Eric Niyonzima" />
          </label>
          <label className="block">
            <span className="mb-2 block text-gray-400">Email Address</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-event-gold" defaultValue="eric@eventhub.rw" />
          </label>
          <label className="block">
            <span className="mb-2 block text-gray-400">Role</span>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none" defaultValue="Administrator" disabled />
          </label>
        </div>
      </div>
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-xl font-bold">Security</h2>
        <div className="space-y-4 text-sm text-gray-300">
          <label className="block">
            <span className="mb-2 block text-gray-400">Change Password</span>
            <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-event-gold" placeholder="New password" />
          </label>
          <label className="block">
            <span className="mb-2 block text-gray-400">Two-factor Auth</span>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-event-gold">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
