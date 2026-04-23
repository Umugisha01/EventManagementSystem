import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
    <div className="glass-card p-10 max-w-md">
      <AlertTriangle className="mx-auto mb-6 w-14 h-14 text-event-gold" />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-400 mb-8">The page you’re looking for does not exist or might have moved.</p>
      <Link to="/" className="btn-primary inline-flex items-center justify-center px-8 py-3">
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
