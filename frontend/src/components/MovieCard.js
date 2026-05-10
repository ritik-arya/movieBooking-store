// MovieCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BADGE_COLORS = {
  hot: { background: '#c0392b', color: '#fff' },
  new: { background: '#E5B93C', color: '#000' },
  soon: { background: '#2980b9', color: '#fff' },
};

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #222',
        cursor: 'pointer',
        transition: 'all 0.25s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#E5B93C';
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(229,185,60,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#222';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      
      {/* 🔥 Badge */}
      {movie.badge && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          ...BADGE_COLORS[movie.badge],
          fontSize: '0.65rem',
          fontWeight: 'bold',
          padding: '3px 8px',
          borderRadius: '5px',
          textTransform: 'uppercase'
        }}>
          {movie.badge}
        </div>
      )}

      {/* 🎬 Poster */}
      <div style={{
        width: '100%',
        aspectRatio: '2/3',
        background: '#222'
      }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* 📄 Info */}
      <div style={{ padding: '10px' }}>
        <div style={{
          fontWeight: 600,
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {movie.title}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          marginTop: '4px'
        }}>
          <span style={{ color: '#E5B93C' }}>★ {movie.rating}</span>
          <span style={{
            background: '#333',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>
            {movie.genre[0]}
          </span>
        </div>

        <div style={{
          fontSize: '0.7rem',
          color: '#aaa',
          marginTop: '5px'
        }}>
          {Math.floor(movie.duration / 60)}h {movie.duration % 60}m • {movie.pgRating}
        </div>
      </div>
    </div>
  );
}