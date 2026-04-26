import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Globe, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../components/Common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [resettingPassword, setResettingPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, resetPasswordAndLogin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const authMsg = localStorage.getItem('auth_message');
    if (authMsg) {
      setError(authMsg);
      localStorage.removeItem('auth_message');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (resettingPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match. Please verify and try again.');
        return;
      }
      if (newPassword.length < 4) {
        setError('Security Protocol: New password must be at least 4 characters long.');
        return;
      }
      if (resetPasswordAndLogin(username, newPassword)) {
        navigate('/dashboard');
      } else {
        setError('Password reset failed. Please contact Administration.');
      }
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      // Role-based landing
      if (res.user?.role === 'attendee') {
        navigate('/dashboard/bookings');
      } else if (res.user?.role === 'staff') {
        navigate('/dashboard/scanner');
      } else {
        navigate('/dashboard');
      }
    } else if (res.requires_reset) {
      setResettingPassword(true);
    } else {
      setError(res.error || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#050505]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-event-gold/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 relative z-10 border-white/5 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-event-gold/10 text-event-gold border border-event-gold/20 text-[10px] font-black uppercase tracking-widest mb-6">
             Rwanda Event Hub • Security Portal
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">{resettingPassword ? 'Reset Account' : 'LOGIN'}</h2>
          <p className="text-gray-500 font-medium tracking-tight">Your gateway to Rwanda's most exclusive experiences and tactical event management.</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl mb-8 text-center">
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!resettingPassword && (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Identity Username</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your handle"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 focus:border-event-gold outline-none transition-all font-bold placeholder:text-gray-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 focus:border-event-gold outline-none transition-all font-bold placeholder:text-gray-700"
                    required
                  />
                   <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-event-gold transition-colors"
                   >
                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                </div>
              </div>
            </>
          )}

          {resettingPassword ? (
            <div className="space-y-6">
                <div className="bg-event-gold/5 border border-event-gold/20 rounded-2xl p-6 text-center">
                  <ShieldAlert className="w-10 h-10 text-event-gold mx-auto mb-4" />
                  <p className="font-black text-event-gold uppercase text-[10px] tracking-widest mb-1">Mandatory Account Reset</p>
                  <p className="text-xs text-gray-500 mb-8 px-4 leading-relaxed">System-generated passwords are temporary. Please establish your private security protocol to continue.</p>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="NEW SECURITY PASSWORD"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-14 outline-none font-black text-white placeholder:text-gray-700 text-xs tracking-widest"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-event-gold"
                      >
                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="CONFIRM NEW PASSWORD"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 outline-none font-black text-white placeholder:text-gray-700 text-xs tracking-widest"
                        required
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center space-x-3 shadow-xl shadow-event-gold/20">
                  <span className="font-black uppercase tracking-[0.2em] text-xs">Verify & Activate Account</span>
                  <ArrowRight className="w-5 h-5 text-black" />
                </button>
            </div>
          ) : (
            <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center space-x-3 shadow-xl shadow-event-gold/20">
              <span className="font-black uppercase tracking-[0.2em] text-xs">Authorize Identity</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          )}
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm mb-4">Or continue with</p>
          <div className="flex justify-center space-x-4">
            <button className="glass-button px-4 flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>GitHub</span>
            </button>
            <button className="glass-button px-4 flex items-center space-x-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" alt="Google" />
              <span>Google</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? {' '}
          <Link to="/register" className="text-event-gold font-bold hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
