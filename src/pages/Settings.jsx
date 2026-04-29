import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 dark:text-gray-400">Configure platform preferences and notification options.</p>
        </div>
        <button className="btn-primary">Update Settings</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-xl font-bold">Platform Settings</h2>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-4 cursor-pointer">
            <div>
              <p className="font-semibold">Dark Mode</p>
              <p className="text-sm text-gray-400">Keep the app in dark theme.</p>
            </div>
            <input 
              type="checkbox" 
              className="h-5 w-5 accent-event-gold" 
              checked={isDark}
              onChange={toggleTheme}
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-4 cursor-pointer">
            <div>
              <p className="font-semibold">Auto-refresh Dashboard</p>
              <p className="text-sm text-gray-400">Get live updates automatically.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-event-gold" defaultChecked />
          </label>
        </div>

        <div className="glass-card p-6 space-y-5">
          <h2 className="text-xl font-bold">Communication</h2>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-4 cursor-pointer">
            <div>
              <p className="font-semibold">Email Alerts</p>
              <p className="text-sm text-gray-400">Receive booking and event notifications.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-event-gold" defaultChecked />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/5 p-4 cursor-pointer">
            <div>
              <p className="font-semibold">SMS Updates</p>
              <p className="text-sm text-gray-400">Receive operational alerts via SMS.</p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-event-gold" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
