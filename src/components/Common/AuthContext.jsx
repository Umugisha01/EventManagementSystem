import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hub_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Check expiry initially on load
      if (parsed.loginTime && Date.now() - parsed.loginTime > 7200000) {
        logout('Your session has expired. Please log in again.');
      } else {
        setUser(parsed);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Poll every minute for session expiry
    const interval = setInterval(() => {
      const savedUser = localStorage.getItem('hub_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.loginTime && Date.now() - parsed.loginTime > 7200000) {
          logout('Your session has expired. Please log in again.');
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = async (username, password) => {
    try {
      const { token, profile } = await authApi.login(username, password);
      
      const userData = { 
        ...profile, 
        token, 
        loginTime: Date.now() 
      };
      
      setUser(userData);
      localStorage.setItem('hub_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      // If API login fails, check dynamicStaff (Local Simulation)
      const dynamicStaff = JSON.parse(localStorage.getItem('dynamicStaff') || '[]');
      const matched = dynamicStaff.find(s => s.username === username);
      
      if (matched && atob(matched.password) === password) {
        if (matched.status !== 'Active') {
           return { success: false, error: 'Your account has been deactivated.' };
        }
        
        // Check if it is the first login
        if (matched.isNewUser) {
           return { success: false, requires_reset: true };
        }

        const userData = {
           username: matched.username,
           fullName: matched.name,
           role: 'staff',
           assignedEvent: matched.event,
           loginTime: Date.now(),
           isDynamic: true
        };
        setUser(userData);
        localStorage.setItem('hub_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }

      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials. Please contact your manager.' };
    }
  };

  const register = async (newUser) => {
    try {
      await authApi.register(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const resetPasswordAndLogin = (username, newPassword) => {
    let dynamicStaff = JSON.parse(localStorage.getItem('dynamicStaff') || '[]');
    const userIndex = dynamicStaff.findIndex(s => s.username === username);
    
    if (userIndex > -1) {
      dynamicStaff[userIndex].password = btoa(newPassword);
      dynamicStaff[userIndex].isNewUser = false;
      localStorage.setItem('dynamicStaff', JSON.stringify(dynamicStaff));
      
      const matchedStaff = dynamicStaff[userIndex];
      const userData = { username: matchedStaff.username, name: matchedStaff.name, role: 'staff', assignedEvent: matchedStaff.event, loginTime: Date.now() };
      setUser(userData);
      localStorage.setItem('hub_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = (message = null) => {
    setUser(null);
    localStorage.removeItem('hub_user');
    if (message) {
      localStorage.setItem('auth_message', message);
    }
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, resetPasswordAndLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
