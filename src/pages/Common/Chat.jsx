import React from 'react';
import { Mail, LifeBuoy } from 'lucide-react';

const Chat = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Platform Support</h1>
        <p className="text-[var(--text-secondary)]">We're here to help you with your events and bookings.</p>
      </div>

      <div className="glass-card p-12 max-w-lg w-full text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-event-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-event-gold/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-event-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <LifeBuoy className="w-10 h-10 text-event-gold" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Our live chat feature is currently undergoing scheduled maintenance to improve reliability. 
            For any immediate support requests, please reach out to our administration team directly via email.
          </p>

          <a 
            href="mailto:rwandaeventhub@gmail.com" 
            className="flex items-center space-x-3 bg-white/5 hover:bg-event-gold/10 border border-[var(--border-color)] hover:border-event-gold/50 px-8 py-4 rounded-2xl transition-all group"
          >
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-event-gold transition-colors" />
            <span className="font-mono text-lg tracking-wide group-hover:text-event-gold transition-colors">rwandaeventhub@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Chat;
