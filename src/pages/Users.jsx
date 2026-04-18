import React from 'react';

const USERS = [
  { name: 'Aline Uwase', role: 'Event Manager', email: 'aline@eventhub.rw', status: 'Active' },
  { name: 'Patrick Niyonzima', role: 'Venue Staff', email: 'patrick@eventhub.rw', status: 'Active' },
  { name: 'Michelle Akimana', role: 'Ticket Agent', email: 'michelle@eventhub.rw', status: 'Pending' },
];

const Users = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-400">Review team accounts, roles, and access status.</p>
      </div>
      <button className="btn-primary">Add New User</button>
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
          {USERS.map((user) => (
            <tr key={user.email} className="border-t border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'Active' ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Users;
