import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-event-charcoal">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-event-gold/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to manage your events and bookings</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                placeholder="admin@event.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-event-gold outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-event-gold outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-white/10 bg-white/5 text-event-gold" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <a href="#" className="text-event-gold hover:underline">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5" />
          </button>
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
