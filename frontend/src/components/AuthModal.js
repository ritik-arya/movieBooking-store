import React, { useState } from 'react';
import { useAuth }    from '../context/AuthContext';
import { useToast }   from '../context/ToastContext';

const inp = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a',
  borderRadius: '8px', padding: '0.65rem 1rem', color: '#f0ede6',
  fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none',
};

export default function AuthModal({ onClose }) {
  const [mode, setMode]     = useState('login'); // 'login' | 'register'
  const [form, setForm]     = useState({ name:'', email:'', password:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast }       = useToast();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        showToast('Welcome back! 🎬', 'success');
      } else {
        if (!form.name) { showToast('Name is required', 'error'); return; }
        await register(form.name, form.email, form.password, form.phone);
        showToast(`Welcome, ${form.name}! 🎉`, 'success');
      }
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }} onClick={onClose}>
      <div style={{
        background: '#1a1a1a', borderRadius: '16px', padding: '2rem',
        width: '90%', maxWidth: '400px', border: '1px solid #2a2a2a',
        animation: 'slideUp 0.3s ease',
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.8rem' }}>🎬</div>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem',
          letterSpacing: '2px', textAlign: 'center', marginBottom: '0.3rem',
        }}>
          {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </h2>
        <p style={{ color: '#666', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {mode === 'login' ? 'Access your CineMax account' : 'Join CineMax today'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {mode === 'register' && (
            <>
              <input style={inp} type="text"  placeholder="Full name"    value={form.name}  onChange={set('name')} required />
              <input style={inp} type="tel"   placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
            </>
          )}
          <input style={inp} type="email"    placeholder="Email address" value={form.email}    onChange={set('email')}    required />
          <input style={inp} type="password" placeholder="Password"      value={form.password} onChange={set('password')} required />

          <button type="submit" disabled={loading} style={{
            background: '#E5B93C', color: '#000', border: 'none', borderRadius: '8px',
            padding: '0.75rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: '0.3rem',
          }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.83rem', color: '#666' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ color: '#E5B93C', cursor: 'pointer' }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </span>
        </p>

        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', color: '#666', fontSize: '1.2rem', cursor: 'pointer',
        }}>✕</button>
      </div>
      <style>{`@keyframes slideUp { from { transform:translateY(30px);opacity:0 } to { transform:none;opacity:1 } }`}</style>
    </div>
  );
}
