import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
