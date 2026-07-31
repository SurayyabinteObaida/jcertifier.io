import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import Verify from './pages/Verify';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const stored = localStorage.getItem('token');
    setToken(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1>Certificate System</h1>
            {token && (
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem('token'))} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<Verify />} />
          
          {token ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/event/:id" element={<EventDetail />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
