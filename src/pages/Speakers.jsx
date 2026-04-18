import React from 'react';

const SPEAKERS = [
  { name: 'Hon. Paula Ingabire', role: 'Keynote', topic: 'Digital Transformation', avatar: 'https://i.pravatar.cc/150?u=speaker1' },
  { name: 'John Kagabo', role: 'Fintech Expert', topic: 'Financial Inclusion', avatar: 'https://i.pravatar.cc/150?u=speaker2' },
  { name: 'Amina Muhayimana', role: 'Travel Consultant', topic: 'Tourism Growth', avatar: 'https://i.pravatar.cc/150?u=speaker3' },
];

const Speakers = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Speakers</h1>
        <p className="text-gray-400">Highlight your speaker roster and their featured topics.</p>
      </div>
      <button className="glass-button">Invite Speaker</button>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {SPEAKERS.map((speaker) => (
        <div key={speaker.name} className="glass-card p-6 text-center space-y-4">
          <img src={speaker.avatar} alt={speaker.name} className="mx-auto h-24 w-24 rounded-full border border-white/10" />
          <div>
            <h2 className="text-xl font-bold">{speaker.name}</h2>
            <p className="text-gray-400">{speaker.role}</p>
          </div>
          <p className="text-sm text-gray-300">Topic: {speaker.topic}</p>
          <button className="btn-primary w-full py-3 text-sm">View Profile</button>
        </div>
      ))}
    </div>
  </div>
);

export default Speakers;
