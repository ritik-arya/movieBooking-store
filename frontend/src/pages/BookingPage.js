import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }  from 'react-router-dom';
import { getShowtime, createBooking } from '../utils/api';
import { useToast }                from '../context/ToastContext';
import SeatMap                     from '../components/SeatMap';

const PREMIUM_ROWS = ['G','H'];
const SEAT_PRICE   = 220;
const PREMIUM_PRICE= 380;
const CONV_FEE     = 30;

const inp = {
  width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid #2a2a2a',
  borderRadius:'8px', padding:'0.65rem 1rem', color:'#f0ede6',
  fontFamily:"'DM Sans',sans-serif", fontSize:'0.88rem', outline:'none',
};

export default function BookingPage() {
  const { showtimeId }            = useParams();
  const navigate                   = useNavigate();
  const { showToast }              = useToast();
  const [showtime, setShowtime]    = useState(null);
  const [loading,  setLoading]     = useState(true);
  const [selected, setSelected]    = useState([]);
  const [payMethod,setPayMethod]   = useState('card');
  const [booking,  setBooking]     = useState(null);  // confirmed booking
  const [processing,setProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getShowtime(showtimeId);
        setShowtime(data);
      } catch { navigate('/'); }
      finally { setLoading(false); }
    })();
  }, [showtimeId, navigate]);

  const toggleSeat = (seatId) => {
    setSelected((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= 6) { showToast('Max 6 seats per booking', 'error'); return prev; }
      return [...prev, seatId];
    });
  };

  const getSeatPrice = (id) => PREMIUM_ROWS.includes(id[0]) ? PREMIUM_PRICE : SEAT_PRICE;
  const subtotal     = selected.reduce((s, id) => s + getSeatPrice(id), 0);
  const total        = subtotal + (selected.length > 0 ? CONV_FEE : 0);

  const handleConfirm = async () => {
    if (!selected.length) { showToast('Select at least one seat', 'error'); return; }
    try {
      setProcessing(true);
      const { data } = await createBooking({ showtimeId, seatIds: selected, paymentMethod: payMethod });
      setBooking(data);
      showToast('Booking confirmed! 🎉', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading)  return <div style={{ color:'#555', padding:'4rem', textAlign:'center' }}>Loading…</div>;
  if (!showtime) return null;

  const movie = showtime.movie;
  const dateStr = new Date(showtime.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });

  // ── Success screen ────────────────────────────────────────────────────────
  if (booking) {
    return (
      <div style={{ maxWidth:'500px', margin:'4rem auto', padding:'2rem', textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:'2px', marginBottom:'0.5rem' }}>BOOKING CONFIRMED!</h2>
        <p style={{ color:'#666', marginBottom:'1.5rem', fontSize:'0.9rem' }}>Your tickets are ready. Enjoy the show!</p>

        <div style={{ background:'#1a1a1a', borderRadius:'12px', padding:'1.2rem', border:'1px dashed #2a2a2a', textAlign:'left', marginBottom:'1.5rem' }}>
          {[
            ['Booking ID', booking.bookingId],
            ['Movie',      movie?.title || booking.movie?.title],
            ['Date',       dateStr],
            ['Time',       showtime.startTime],
            ['Seats',      booking.seats.map((s) => s.seatId).join(', ')],
            ['Total',      `₹ ${booking.totalAmount.toLocaleString('en-IN')}`],
          ].map(([label, value]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.3rem 0', fontSize:'0.83rem' }}>
              <span style={{ color:'#666' }}>{label}</span>
              <span style={{ fontWeight: label === 'Total' ? 600 : 400, color: label === 'Total' ? '#E5B93C' : '#f0ede6' }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'0.8rem' }}>
          <button
            onClick={() => navigate('/my-bookings')}
            style={{ flex:1, background:'#E5B93C', color:'#000', border:'none', borderRadius:'8px', padding:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ flex:1, background:'none', border:'1px solid #2a2a2a', color:'#888', borderRadius:'8px', padding:'0.75rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
          >
            Browse More
          </button>
        </div>
      </div>
    );
  }

  // ── Main Booking UI ───────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem' }}>
      <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'0.85rem', marginBottom:'1.5rem', fontFamily:"'DM Sans',sans-serif" }}>
        ← Back
      </button>

      {/* Movie + showtime summary */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <div style={{ fontSize:'2.5rem' }}>{movie?.emoji || '🎬'}</div>
        <div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:'1px' }}>{movie?.title}</h2>
          <p style={{ color:'#666', fontSize:'0.85rem' }}>{dateStr} &nbsp;·&nbsp; {showtime.startTime} &nbsp;·&nbsp; {showtime.theater}</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'2rem' }}>
        {/* Left column */}
        <div>
          <div style={{ background:'#1a1a1a', borderRadius:'12px', padding:'1.5rem', border:'1px solid #222', marginBottom:'1.5rem' }}>
            <SeatMap seats={showtime.seats} selectedSeats={selected} onToggle={toggleSeat} />
          </div>

          {/* Payment */}
          {selected.length > 0 && (
            <div style={{ background:'#1a1a1a', borderRadius:'12px', padding:'1.5rem', border:'1px solid #222' }}>
              <div style={{ fontSize:'0.75rem', color:'#555', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'1rem' }}>Payment Method</div>

              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem' }}>
                {['card','upi','wallet'].map((m) => (
                  <button key={m} onClick={() => setPayMethod(m)} style={{
                    background: payMethod === m ? 'rgba(229,185,60,0.08)' : 'none',
                    border: `1px solid ${payMethod === m ? '#E5B93C' : '#2a2a2a'}`,
                    color: payMethod === m ? '#E5B93C' : '#888',
                    borderRadius:'8px', padding:'0.4rem 0.9rem', cursor:'pointer',
                    fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', textTransform:'capitalize',
                  }}>
                    {m === 'card' ? '💳 Card' : m === 'upi' ? '📲 UPI' : '👛 Wallet'}
                  </button>
                ))}
              </div>

              {payMethod === 'card' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
                  <input style={inp} type="text"     placeholder="Card number (e.g. 4242 4242 4242 4242)" maxLength={19} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.7rem' }}>
                    <input style={inp} type="text" placeholder="MM/YY"  maxLength={5} />
                    <input style={inp} type="text" placeholder="CVV"     maxLength={3} />
                  </div>
                  <input style={inp} type="text" placeholder="Name on card" />
                </div>
              )}
              {payMethod === 'upi' && (
                <input style={inp} type="text" placeholder="Enter UPI ID (e.g. name@upi)" />
              )}
              {payMethod === 'wallet' && (
                <p style={{ color:'#888', fontSize:'0.85rem' }}>
                  Wallet balance: <span style={{ color:'#E5B93C', fontWeight:600 }}>₹ 2,500.00</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right column – Order Summary */}
        <div style={{ position:'sticky', top:'80px', height:'fit-content' }}>
          <div style={{ background:'#1a1a1a', borderRadius:'12px', padding:'1.2rem', border:'1px solid #222' }}>
            <div style={{ fontSize:'0.75rem', color:'#555', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'1rem' }}>Order Summary</div>

            {selected.length === 0 ? (
              <p style={{ color:'#444', fontSize:'0.85rem', textAlign:'center', padding:'1rem 0' }}>Select seats to continue</p>
            ) : (
              <>
                {[
                  ['Movie',    movie?.title],
                  ['Date',     dateStr],
                  ['Time',     showtime.startTime],
                  ['Seats',    selected.join(', ')],
                  ['Subtotal', `₹ ${subtotal.toLocaleString('en-IN')}`],
                  ['Conv. Fee',`₹ ${CONV_FEE}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.35rem 0', fontSize:'0.83rem' }}>
                    <span style={{ color:'#666' }}>{label}</span>
                    <span style={{ color:'#f0ede6', maxWidth:'140px', textAlign:'right', wordBreak:'break-word' }}>{val}</span>
                  </div>
                ))}

                <div style={{ borderTop:'1px solid #2a2a2a', marginTop:'0.6rem', paddingTop:'0.8rem', display:'flex', justifyContent:'space-between', fontWeight:600, fontSize:'1rem' }}>
                  <span>Total</span>
                  <span style={{ color:'#E5B93C' }}>₹ {total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={processing}
                  style={{
                    width:'100%', marginTop:'1rem', background:'#E5B93C', color:'#000',
                    border:'none', borderRadius:'8px', padding:'0.8rem',
                    fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:'0.9rem',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    opacity: processing ? 0.7 : 1,
                  }}
                >
                  {processing ? 'Processing…' : `Confirm & Pay ₹ ${total.toLocaleString('en-IN')}`}
                </button>
              </>
            )}
          </div>

          {/* Pricing info */}
          <div style={{ background:'#111', borderRadius:'10px', padding:'1rem', border:'1px solid #1a1a1a', marginTop:'1rem', fontSize:'0.78rem', color:'#555' }}>
            <div style={{ marginBottom:'0.3rem' }}>💺 Standard seats — ₹220</div>
            <div>👑 Premium seats (G, H rows) — ₹380</div>
          </div>
        </div>
      </div>
    </div>
  );
}
