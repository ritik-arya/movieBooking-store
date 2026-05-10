import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie, getShowtimes }  from '../utils/api';
import { useAuth }                 from '../context/AuthContext';
import AuthModal                   from '../components/AuthModal';

function getDates() {
  const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const today  = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      label:    `${DAYS[d.getDay()]} ${d.getDate()}`,
      dateStr:  d.toISOString().split('T')[0],
      display:  `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      day:      DAYS[d.getDay()],
      num:      d.getDate(),
    };
  });
}

const DATES = getDates();

export default function MoviePage() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const [movie,      setMovie]      = useState(null);
  const [showtimes,  setShowtimes]  = useState([]);
  const [selDate,    setSelDate]    = useState(0);
  const [selShowtime,setSelShowtime]= useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showAuth,   setShowAuth]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMovie(id);
        setMovie(data);
      } catch { navigate('/'); }
      finally { setLoading(false); }
    })();
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await getShowtimes({ movieId: id, date: DATES[selDate].dateStr });
        setShowtimes(data);
        setSelShowtime(null);
      } catch (err) { console.error(err); }
    })();
  }, [id, selDate]);

  const handleBook = () => {
    if (!selShowtime) return;
    if (!user) { setShowAuth(true); return; }
    navigate(`/book/${selShowtime._id}`);
  };

  if (loading) return <div style={{ color:'#555', padding:'4rem', textAlign:'center' }}>Loading…</div>;
  if (!movie)  return null;

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'0.85rem', marginBottom:'1.5rem', fontFamily:"'DM Sans',sans-serif" }}
      >
        ← Back
      </button>

      {/* Detail Hero */}
      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'2rem', marginBottom:'2rem' }}>
        <div style={{
          aspectRatio:'2/3', background:'#1a1a1a', borderRadius:'12px',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'5rem', border:'1px solid #222',
        }}>
          {movie.poster
            ? <img src={movie.poster} alt={movie.title} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }} />
            : movie.emoji}
        </div>

        <div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.8rem', letterSpacing:'2px', marginBottom:'0.5rem' }}>
            {movie.title}
          </h1>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', fontSize:'0.83rem', color:'#666', marginBottom:'0.8rem' }}>
            <span>⏱ {Math.floor(movie.duration/60)}h {movie.duration%60}m</span>
            <span>📅 {new Date(movie.releaseDate).getFullYear()}</span>
            <span>🎬 {movie.director}</span>
            <span style={{ background:'rgba(229,185,60,0.1)', color:'#E5B93C', border:'1px solid rgba(229,185,60,0.3)', borderRadius:'4px', padding:'0.1rem 0.45rem' }}>
              {movie.pgRating}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <span style={{ color:'#E5B93C', fontSize:'1rem' }}>{'★'.repeat(Math.round(movie.rating/2))}</span>
            <span style={{ fontWeight:500 }}>{movie.rating}</span>
            <span style={{ color:'#555', fontSize:'0.8rem' }}>/10</span>
          </div>
          <p style={{ color:'#999', lineHeight:1.8, fontSize:'0.92rem', marginBottom:'1.2rem', maxWidth:'560px' }}>
            {movie.description}
          </p>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            {movie.cast?.map((c) => (
              <span key={c.name} style={{
                background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'20px',
                padding:'0.25rem 0.75rem', fontSize:'0.77rem', color:'#888',
              }}>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Showtime Selector */}
      <div style={{ background:'#1a1a1a', borderRadius:'12px', padding:'1.5rem', border:'1px solid #222', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:'0.75rem', color:'#555', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'1rem' }}>Select Date</div>
        <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.3rem', marginBottom:'1.2rem' }}>
          {DATES.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelDate(i)}
              style={{
                background: i === selDate ? '#E5B93C' : 'none',
                border: `1px solid ${i === selDate ? '#E5B93C' : '#2a2a2a'}`,
                borderRadius:'10px', padding:'0.5rem 0.9rem', cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif",
                color: i === selDate ? '#000' : '#666',
                minWidth:'56px', textAlign:'center', flexShrink:0,
              }}
            >
              <div style={{ fontSize:'0.65rem', letterSpacing:'0.5px' }}>{d.day}</div>
              <div style={{ fontSize:'1rem', fontWeight:600 }}>{d.num}</div>
            </button>
          ))}
        </div>

        <div style={{ fontSize:'0.75rem', color:'#555', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'0.8rem' }}>Select Showtime</div>
        {showtimes.length === 0 ? (
          <p style={{ color:'#555', fontSize:'0.85rem' }}>No showtimes available for this date.</p>
        ) : (
          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            {showtimes.map((st) => (
              <button
                key={st._id}
                onClick={() => setSelShowtime(st)}
                style={{
                  background: selShowtime?._id === st._id ? '#E5B93C' : 'none',
                  border: `1px solid ${selShowtime?._id === st._id ? '#E5B93C' : '#2a2a2a'}`,
                  borderRadius:'8px', padding:'0.5rem 1.1rem',
                  color: selShowtime?._id === st._id ? '#000' : '#f0ede6',
                  cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                  fontSize:'0.85rem', fontWeight: selShowtime?._id === st._id ? 600 : 400,
                }}
              >
                {st.startTime}
                <span style={{ display:'block', fontSize:'0.65rem', color: selShowtime?._id === st._id ? '#555' : '#444', marginTop:'2px' }}>
                  {st.availableSeats} seats left
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleBook}
        disabled={!selShowtime}
        style={{
          background: selShowtime ? '#E5B93C' : '#2a2a2a',
          color: selShowtime ? '#000' : '#555',
          border:'none', borderRadius:'10px', padding:'0.85rem 2.5rem',
          fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:'0.95rem',
          cursor: selShowtime ? 'pointer' : 'not-allowed',
        }}
      >
        {selShowtime ? `Book Seats →` : 'Select a showtime first'}
      </button>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
