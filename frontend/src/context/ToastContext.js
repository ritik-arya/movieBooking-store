import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let _showToast = null;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  _showToast = showToast;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          background: '#1a1a1a', border: `1px solid ${toast.type === 'success' ? '#1db954' : toast.type === 'error' ? '#c0392b' : '#333'}`,
          color: toast.type === 'success' ? '#1db954' : toast.type === 'error' ? '#e74c3c' : '#f0ede6',
          borderRadius: '10px', padding: '0.8rem 1.4rem', fontSize: '0.88rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: '320px',
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast.message}
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
export const toast    = (msg, type) => _showToast?.(msg, type);
