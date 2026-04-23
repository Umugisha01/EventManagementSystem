import React, { useState } from 'react';

const INITIAL_SPEAKERS = [
  {
    name: 'Hon. Paula Ingabire',
    role: 'Keynote',
    topic: 'Digital Transformation',
    avatar: 'https://i.pravatar.cc/150?u=speaker1',
    email: 'paula.ingabire@eventhub.rw',
    bio: 'Minister of ICT and Innovation with a strong focus on digital Rwanda, tech policy, and smart nation initiatives.',
  },
  {
    name: 'John Kagabo',
    role: 'Fintech Expert',
    topic: 'Financial Inclusion',
    avatar: 'https://i.pravatar.cc/150?u=speaker2',
    email: 'john.kagabo@eventhub.rw',
    bio: 'Fintech advisor helping startups scale digital payment solutions across East Africa.',
  },
  {
    name: 'Amina Muhayimana',
    role: 'Travel Consultant',
    topic: 'Tourism Growth',
    avatar: 'https://i.pravatar.cc/150?u=speaker3',
    email: 'amina.muhayimana@eventhub.rw',
    bio: 'Tourism growth strategist with expertise in destination promotion and sustainable travel experiences.',
  },
];

const Speakers = () => {
  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    role: '',
    topic: '',
    email: '',
    bio: '',
  });

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    setSpeakers((prev) => [
      {
        ...inviteForm,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(inviteForm.email)}`,
      },
      ...prev,
    ]);
    setInviteForm({ name: '', role: '', topic: '', email: '', bio: '' });
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Speakers</h1>
          <p className="text-gray-400">Highlight your speaker roster and their featured topics.</p>
        </div>
        <button className="glass-button" onClick={() => setShowInviteModal(true)}>
          Invite Speaker
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {speakers.map((speaker) => (
          <div key={speaker.email || speaker.name} className="glass-card p-6 text-center space-y-4">
            <img
              src={speaker.avatar}
              alt={speaker.name}
              className="mx-auto h-24 w-24 rounded-full border border-white/10"
            />
            <div>
              <h2 className="text-xl font-bold">{speaker.name}</h2>
              <p className="text-gray-400">{speaker.role}</p>
            </div>
            <p className="text-sm text-gray-300">Topic: {speaker.topic}</p>
            <button
              className="btn-primary w-full py-3 text-sm"
              onClick={() => setSelectedSpeaker(speaker)}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Invite Speaker</h2>
                <p className="text-gray-400">Add a new speaker to your roster.</p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  name="name"
                  value={inviteForm.name}
                  onChange={handleInviteChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="Enter speaker name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role</label>
                  <input
                    name="role"
                    value={inviteForm.role}
                    onChange={handleInviteChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Keynote / Expert"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Topic</label>
                  <input
                    name="topic"
                    value={inviteForm.topic}
                    onChange={handleInviteChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Presentation topic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={handleInviteChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="speaker@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={inviteForm.bio}
                  onChange={handleInviteChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold resize-none"
                  placeholder="Short speaker biography"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="glass-button"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSpeaker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Speaker Profile</h2>
                <p className="text-gray-400">Review speaker details and contact information.</p>
              </div>
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <img
                src={selectedSpeaker.avatar}
                alt={selectedSpeaker.name}
                className="h-28 w-28 rounded-full border border-white/10"
              />
              <div>
                <h3 className="text-2xl font-bold">{selectedSpeaker.name}</h3>
                <p className="text-gray-400">{selectedSpeaker.role}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-left text-gray-300">
              <div>
                <p className="text-sm text-gray-400">Topic</p>
                <p className="font-medium">{selectedSpeaker.topic}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">{selectedSpeaker.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">About</p>
                <p className="font-medium">{selectedSpeaker.bio}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="btn-primary"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Speakers;
