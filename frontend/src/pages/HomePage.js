import React, { useEffect, useState } from 'react';
import { getMovies } from '../utils/api';
import MovieCard     from '../components/MovieCard';

const GENRES = ['All', 'action', 'sci-fi', 'drama', 'thriller', 'comedy', 'music'];

export default function HomePage() {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre,   setGenre]   = useState('All');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const params = {};
        if (genre !== 'All') params.genre = genre;
        if (search)          params.search = search;
        const { data } = await getMovies(params);
        setMovies(data.movies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [genre, search]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#1a0a00 0%,#0d0d0d 50%,#000a1a 100%)',
        borderRadius: '16px', padding: '3rem 2.5rem', marginBottom: '2.5rem',
        border: '1px solid #1a1a1a', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize:'0.7rem', letterSpacing:'3px', color:'#E5B93C', marginBottom:'0.5rem' }}>NOW SHOWING</div>
        <h1 style={{
          fontFamily:"'Bebas Neue', sans-serif", fontSize:'3.5rem',
          letterSpacing:'2px', lineHeight:1, marginBottom:'0.8rem',
        }}>
          Book Your <span style={{ color:'#E5B93C' }}>Perfect</span> Seat
        </h1>
        <p style={{ color:'#666', fontSize:'0.95rem', maxWidth:'480px', lineHeight:1.7, marginBottom:'1.5rem' }}>
          Experience cinema like never before. Choose your film, pick your seat, and enjoy the show.
        </p>
        <div style={{ display:'flex', gap:'0.5rem', maxWidth:'460px' }}>
          <input
            type="text"
            placeholder="Search movies, genres…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid #2a2a2a',
              borderRadius:'8px', padding:'0.7rem 1rem', color:'#f0ede6',
              fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', outline:'none',
            }}
          />
          <button
            style={{
              background:'#E5B93C', color:'#000', border:'none', borderRadius:'8px',
              padding:'0.7rem 1.4rem', fontFamily:"'DM Sans',sans-serif",
              fontWeight:600, fontSize:'0.88rem', cursor:'pointer',
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Genre filters */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            style={{
              background: genre === g ? 'rgba(229,185,60,0.08)' : 'none',
              border: `1px solid ${genre === g ? '#E5B93C' : '#2a2a2a'}`,
              color: genre === g ? '#E5B93C' : '#888',
              borderRadius:'20px', padding:'0.35rem 0.9rem',
              fontSize:'0.82rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
              transition:'all 0.2s', textTransform:'capitalize',
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color:'#555', textAlign:'center', padding:'4rem' }}>Loading movies…</div>
      ) : movies.length === 0 ? (
        <div style={{ color:'#555', textAlign:'center', padding:'4rem' }}>No movies found.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(185px, 1fr))', gap:'1.5rem' }}>
          {movies.map((m) => <MovieCard key={m._id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
