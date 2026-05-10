import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal   from './AuthModal';

const S = {
  nav: {
    background: '#111', borderBottom: '1px solid #222', padding: '0 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '60px', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.9rem',
    letterSpacing: '2px', color: '#E5B93C', textDecoration: 'none',
  },
  logoSpan: { color: '#f0ede6' },
  links:    { display: 'flex', alignItems: 'center', gap: '1rem' },
  navLink:  {
    color: '#888', textDecoration: 'none', fontSize: '0.87rem',
    padding: '0.4rem 0.8rem', borderRadius: '6px', transition: 'all 0.2s',
  },
  pill: {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '20px',
    padding: '0.3rem 1rem', fontSize: '0.82rem', color: '#888',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
    transition: 'all 0.2s',
  },
  avatar: {
    width: '26px', height: '26px', borderRadius: '50%',
    background: '#E5B93C', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#000',
  },
};

export default function Navbar() {
  const { user, logout }      = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate               = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav style={S.nav}>
        <Link to="/" style={S.logo}>CINE<span style={S.logoSpan}>MAX</span></Link>

        <div style={S.links}>
          <Link to="/"            style={{ ...S.navLink }}>Movies</Link>
          {user && (
            <Link to="/my-bookings" style={{ ...S.navLink }}>My Bookings</Link>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <div style={S.pill} onClick={() => setMenuOpen(!menuOpen)}>
                <div style={S.avatar}>{user.name.slice(0,2).toUpperCase()}</div>
                <span style={{ color: '#f0ede6' }}>{user.name.split(' ')[0]}</span>
              </div>
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, background: '#1a1a1a',
                  border: '1px solid #2a2a2a', borderRadius: '10px', minWidth: '160px',
                  overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ padding: '0.6rem 1rem', fontSize: '0.78rem', color: '#666', borderBottom: '1px solid #222' }}>
                    {user.email}
                  </div>
                  <button onClick={handleLogout} style={{
                    width: '100%', background: 'none', border: 'none', color: '#e74c3c',
                    padding: '0.7rem 1rem', textAlign: 'left', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                  }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: '#E5B93C', color: '#000', border: 'none', borderRadius: '8px',
                padding: '0.45rem 1.1rem', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {menuOpen && <div style={{ position:'fixed', inset:0, zIndex:99 }} onClick={() => setMenuOpen(false)} />}
    </>
  );
}
