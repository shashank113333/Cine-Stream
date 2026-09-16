import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

export const Navbar = ({ favoritesCount = 0 }) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(12, 15, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 24px',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* लोगो */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Film size={26} color="#e50914" />
          <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            CINE<span style={{ color: '#e50914' }}>STREAM</span>
          </span>
        </NavLink>

        {/* नेविगेशन लिंक्स */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.92rem',
              fontWeight: 600,
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}
          >
            Discover
          </NavLink>

          <NavLink
            to="/favorites"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.92rem',
              fontWeight: 600,
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}
          >
            <Heart size={16} color="#e50914" fill={favoritesCount > 0 ? '#e50914' : 'none'} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span
                style={{
                  backgroundColor: '#e50914',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '9999px',
                }}
              >
                {favoritesCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};