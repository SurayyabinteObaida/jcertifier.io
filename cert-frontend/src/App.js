import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
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
        {token && (
          <nav className="navbar">
            <div className="nav-container">
              <h1>JCertifier.io</h1>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/login" element={
            token ? <Navigate to="/" /> : <Login onLogin={() => setToken(localStorage.getItem('token'))} />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/" /> : <Register />
          } />

          {token ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Landing />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
