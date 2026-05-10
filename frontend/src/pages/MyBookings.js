import React, { useEffect, useState } from 'react';
import { useNavigate }    from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../utils/api';
import { useToast }       from '../context/ToastContext';

const STATUS_STYLE = {
  confirmed: { bg:'rgba(29,185,84,0.1)',  color:'#1db954', bd:'rgba(29,185,84,0.3)'  },
  cancelled: { bg:'rgba(255,255,255,0.04)', color:'#555',  bd:'#2a2a2a'              },
  expired:   { bg:'rgba(255,255,255,0.04)', color:'#555',  bd:'#2a2a2a'              },
};

export default function MyBookings() {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [cancelling,setCancelling]= useState(null);
  const { showToast }             = useToast();
  const navigate                   = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await getMyBookings();
      setBookings(data);
    } catch (err) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? Refund will be initiated.')) return;
    try {
      setCancelling(id);
      await cancelBooking(id);
      showToast('Booking cancelled. Refund initiated.', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Cancellation failed', 'error');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem' }}>
      <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:'2px', marginBottom:'1.5rem' }}>
        <span style={{ color:'#E5B93C' }}>MY</span> BOOKINGS
      </h1>

      {loading ? (
        <div style={{ color:'#555', textAlign:'center', padding:'4rem' }}>Loading…</div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:'#555' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:0.4 }}>🎫</div>
          <p style={{ marginBottom:'1.2rem' }}>No bookings yet. Book your first ticket!</p>
          <button
            onClick={() => navigate('/')}
            style={{ background:'#E5B93C', color:'#000', border:'none', borderRadius:'8px', padding:'0.7rem 1.5rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {bookings.map((b) => {
            const st  = STATUS_STYLE[b.status] || STATUS_STYLE.cancelled;
            const movie = b.movie || {};
            const show  = b.showtime || {};
            const dateStr = show.date
              ? new Date(show.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })
              : '—';

            return (
              <div
                key={b._id}
                style={{
                  background:'#1a1a1a', borderRadius:'12px', padding:'1.2rem 1.5rem',
                  border:'1px solid #222', display:'grid',
                  gridTemplateColumns:'52px 1fr auto', gap:'1rem', alignItems:'center',
                }}
              >
                {/* Emoji */}
                <div style={{
                  width:'52px', height:'52px', background:'#222', borderRadius:'10px',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem',
                }}>
                  {movie.emoji || '🎬'}
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontWeight:500, marginBottom:'0.2rem' }}>{movie.title || 'Movie'}</div>
                  <div style={{ display:'flex', gap:'1rem', fontSize:'0.8rem', color:'#666', flexWrap:'wrap', marginTop:'0.3rem' }}>
                    <span>📅 {dateStr}</span>
                    <span>⏰ {show.startTime || '—'}</span>
                    <span>💺 {b.seats?.map((s) => s.seatId).join(', ')}</span>
                    <span>₹ {b.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize:'0.7rem', color:'#444', marginTop:'0.3rem' }}>
                    {b.bookingId} &nbsp;·&nbsp; Booked {new Date(b.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                {/* Status + cancel */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem' }}>
                  <span style={{
                    background: st.bg, color: st.color, border:`1px solid ${st.bd}`,
                    borderRadius:'20px', padding:'0.2rem 0.7rem',
                    fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.3px', textTransform:'uppercase',
                  }}>
                    {b.status}
                  </span>
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      disabled={cancelling === b._id}
                      style={{
                        background:'none', border:'1px solid #3a1a1a', color:'#c0392b',
                        borderRadius:'6px', padding:'0.25rem 0.6rem', fontSize:'0.72rem',
                        cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                      }}
                    >
                      {cancelling === b._id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
