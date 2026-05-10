import React from 'react';

const ROWS         = ['A','B','C','D','E','F','G','H'];
const PREMIUM_ROWS = ['G','H'];
const SEATS_PER_ROW = 10;

export default function SeatMap({ seats = [], selectedSeats = [], onToggle }) {
  const seatMap = {};
  seats.forEach((s) => { seatMap[s.seatId] = s; });

  return (
    <div>
      {/* Screen */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          background: 'linear-gradient(to bottom, rgba(229,185,60,0.3), transparent)',
          height: '8px', borderRadius: '4px 4px 0 0', maxWidth: '75%', margin: '0 auto 0.3rem',
        }} />
        <div style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>
          SCREEN
        </div>
      </div>

      {/* Seat grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
        {ROWS.map((row) => (
          <div key={row} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <div style={{ width: '18px', fontSize: '0.62rem', color: '#555', textAlign: 'right', marginRight: '0.3rem' }}>
              {row}
            </div>
            {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
              const seatId    = `${row}${i + 1}`;
              const seat      = seatMap[seatId];
              const isPremium = PREMIUM_ROWS.includes(row);
              const isBooked  = seat?.status === 'booked';
              const isSelected = selectedSeats.includes(seatId);

              let bg, border, cursor;
              if (isBooked) {
                bg = '#222'; border = '#1a1a1a'; cursor = 'not-allowed';
              } else if (isSelected) {
                bg = isPremium ? '#7B2D8B' : '#E5B93C';
                border = isPremium ? '#9B4DAB' : '#E5B93C';
                cursor = 'pointer';
              } else if (isPremium) {
                bg = 'rgba(90,42,138,0.15)'; border = '#5a2a8a'; cursor = 'pointer';
              } else {
                bg = '#222'; border = '#3a3a3a'; cursor = 'pointer';
              }

              return (
                <div
                  key={seatId}
                  title={`${seatId} • ${isPremium ? 'Premium ₹380' : 'Standard ₹220'}`}
                  onClick={() => !isBooked && onToggle(seatId)}
                  style={{
                    width: '26px', height: '24px', borderRadius: '4px 4px 3px 3px',
                    border: `1px solid ${border}`, background: bg,
                    cursor, opacity: isBooked ? 0.35 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5rem', color: isSelected ? (isPremium ? '#fff' : '#000') : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isBooked && !isSelected) e.currentTarget.style.borderColor = '#E5B93C'; }}
                  onMouseLeave={(e) => { if (!isBooked && !isSelected) e.currentTarget.style.borderColor = border; }}
                >
                  {isSelected ? '✓' : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', marginTop:'1.2rem', flexWrap:'wrap' }}>
        {[
          { label:'Available',  bg:'#222',                   bd:'#3a3a3a' },
          { label:'Selected',   bg:'#E5B93C',                bd:'#E5B93C' },
          { label:'Booked',     bg:'#222',                   bd:'#1a1a1a', opacity:0.35 },
          { label:'Premium',    bg:'rgba(90,42,138,0.4)',    bd:'#8a4abf' },
        ].map(({ label, bg, bd, opacity }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color:'#666' }}>
            <div style={{ width:'16px', height:'14px', borderRadius:'3px', background:bg, border:`1px solid ${bd}`, opacity: opacity || 1 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
