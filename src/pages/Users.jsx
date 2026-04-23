import React, { useState } from 'react';

const INITIAL_USERS = [
  { name: 'Aline Uwase', role: 'Event Manager', email: 'aline@eventhub.rw', status: 'Active' },
  { name: 'Patrick Niyonzima', role: 'Venue Staff', email: 'patrick@eventhub.rw', status: 'Active' },
  { name: 'Michelle Akimana', role: 'Ticket Agent', email: 'michelle@eventhub.rw', status: 'Pending' },
];

const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    role: '',
    email: '',
    status: 'Pending',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers((prev) => [
      {
        ...newUserForm,
      },
      ...prev,
    ]);
    setNewUserForm({ name: '', role: '', email: '', status: 'Pending' });
    setShowAddUserModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-400">Review team accounts, roles, and access status.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddUserModal(true)}>
          Add New User
        </button>
      </div>

      <div className="glass-card overflow-hidden border-white/10">
        <table className="min-w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === 'Active'
                        ? 'bg-green-500/10 text-green-300'
                        : 'bg-yellow-500/10 text-yellow-300'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Add New User</h2>
                <p className="text-gray-400">Create a new team account and assign a role.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  name="name"
                  value={newUserForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role</label>
                  <input
                    name="role"
                    value={newUserForm.role}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="Event Manager / Ticket Agent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  name="status"
                  value={newUserForm.status}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-event-gold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="glass-button"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
