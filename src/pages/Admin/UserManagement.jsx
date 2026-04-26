import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  X,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { usersApi } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    role: 'Attendee',
    isActive: true
  });

  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({ fullName: '', email: '', username: '', password: '', phoneNumber: '', role: 'Attendee', isActive: true });
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      username: user.userName,
      password: '', // Password not editable here
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      isActive: user.isActive
    });
    setShowAddModal(true);
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+250[0-9]{9}$/;

    if (formData.fullName.trim().length < 3) return "Full Name must be at least 3 characters.";
    if (!emailRegex.test(formData.email)) return "Invalid email format.";
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) 
      return "Invalid Rwanda phone number format (+250...).";
    
    if (!isEditing) {
      if (formData.username.length < 4) return "Username must be at least 4 characters.";
      if (formData.password.length < 6) return "Password must be at least 6 characters.";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (isEditing) {
        await usersApi.updateUser(selectedUser.id, {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          isActive: formData.isActive
        });
        alert('User updated successfully!');
      } else {
        await usersApi.createUser(formData);
        alert('User created successfully!');
      }
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.toString());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.toString());
    }
  };

  const toggleStatus = async (user) => {
    try {
      await usersApi.updateUser(user.id, {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: !user.isActive
      });
      fetchUsers();
    } catch (err) {
      alert(err.toString());
    }
  };

  // Filter and Pagination
  const filteredUsers = users.filter(u => {
    const matchSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'All' || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const getRoleBadge = (role) => {
    const r = role.toLowerCase();
    switch (r) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'manager': return 'bg-event-gold/10 text-event-gold border-event-gold/20';
      case 'staff': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-[var(--text-secondary)]">CRUD operations for system users, managers and administrators.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.length} icon={Users} color="gold" />
        <StatCard title="Administrators" value={users.filter(u => u.role === 'Admin').length} icon={Shield} color="red" />
        <StatCard title="Managers" value={users.filter(u => u.role === 'Manager').length} icon={UserIcon} color="blue" />
        <StatCard title="Staff" value={users.filter(u => u.role === 'Staff').length} icon={Users} color="purple" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl py-2.5 pl-12 pr-4 focus:border-event-gold outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
             <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest whitespace-nowrap">Filter Role:</span>
             <select 
               value={selectedRole}
               onChange={(e) => setSelectedRole(e.target.value)}
               className="bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-event-gold outline-none cursor-pointer"
             >
                <option value="All">All Operations</option>
                <option value="Admin">Administrators</option>
                <option value="Manager">Managers</option>
                <option value="Staff">Staff</option>
                <option value="Attendee">Attendees</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[var(--text-secondary)] text-xs uppercase font-bold tracking-widest">
                <th className="px-6 py-5">System Member</th>
                <th className="px-6 py-5">Role & Access</th>
                <th className="px-6 py-5">Contact Details</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-10 h-10 border-4 border-event-gold border-t-transparent rounded-full animate-spin" />
                      <p className="text-[var(--text-secondary)] animate-pulse">Communicating with Backend...</p>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-event-gold/10 flex items-center justify-center font-bold text-event-gold border border-event-gold/20">
                        {u.fullName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{u.fullName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">@{u.userName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs text-[var(--text-secondary)]">
                        <Mail className="w-3 h-3 mr-2 text-event-gold" /> {u.email}
                      </div>
                      <div className="flex items-center text-xs text-[var(--text-secondary)]">
                        <Phone className="w-3 h-3 mr-2 text-event-gold" /> {u.phoneNumber || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(u)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        u.isActive 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>{u.isActive ? 'ACTIVE' : 'SUSPENDED'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(u)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-event-gold transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Fallback for Empty Search */}
        {!loading && filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No users found matching "{searchTerm}"</p>
          </div>
        )}

        <div className="p-6 border-t border-[var(--border-color)] flex items-center justify-between">
          <p className="text-xs text-[var(--text-secondary)] uppercase font-bold tracking-widest">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex space-x-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-[var(--border-color)] rounded-xl hover:bg-white/5 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-[var(--border-color)] rounded-xl hover:bg-white/5 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-event-gold/10 rounded-2xl">
                  {isEditing ? <Edit2 className="w-6 h-6 text-event-gold" /> : <UserPlus className="w-6 h-6 text-event-gold" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{isEditing ? 'Update User Profile' : 'Register System User'}</h2>
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                    {isEditing ? `Editing user #${selectedUser?.id}` : 'Assign database roles & permissions'}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none transition-all" 
                      placeholder="Jane Doe" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled={isEditing}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none transition-all ${isEditing ? 'opacity-50 cursor-not-allowed' : 'focus:border-event-gold'}`} 
                      placeholder="jane@hub.rw" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Username</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      disabled={isEditing}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className={`w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none transition-all ${isEditing ? 'opacity-50 cursor-not-allowed' : 'focus:border-event-gold'}`} 
                      placeholder="janedoe" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none transition-all" 
                      placeholder="+2507XXXXXXXX" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {!isEditing && (
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Password</label>
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none transition-all" 
                        placeholder="••••••••" 
                        required
                      />
                    </div>
                  )}
                  <div className={isEditing ? 'col-span-2' : ''}>
                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">System Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/5 border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-event-gold outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Attendee" className="bg-[#18181b]">Attendee</option>
                      <option value="Staff" className="bg-[#18181b]">Staff Member</option>
                      <option value="Manager" className="bg-[#18181b]">Event Manager</option>
                      <option value="Admin" className="bg-[#18181b]">Administrator</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                   <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-[var(--border-color)]">
                      <div className="flex-1">
                        <p className="text-sm font-bold">Account Access</p>
                        <p className="text-xs text-[var(--text-secondary)]">Toggle to enable or disable system access</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.isActive ? 'bg-green-500' : 'bg-gray-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                )}

                <div className="flex space-x-4 pt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 glass-button py-4">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-4">
                    {isEditing ? 'Save Changes' : 'Confirm Registration'}
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

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    gold: 'bg-event-gold/10 text-event-gold border-event-gold/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="glass-card p-6 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
      <div className={`p-3 rounded-2xl ${colors[color] || colors.gold}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">{title}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  );
};

export default UserManagement;
