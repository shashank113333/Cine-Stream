import React from 'react';
import { NavLink } from 'react-router-dom';
import { MovieGrid } from '../components/MovieGrid';
import { Heart, Compass } from 'lucide-react';

export const Favorites = ({ favorites, onToggleFavorite, isFavorite }) => {
  return (
    <div className="main-viewport">
      {/* पेज हेडिंग */}
      <div style={{ marginBottom: '28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={26} color="#e50914" fill="#e50914" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Favorites & Watchlist</h1>
        </div>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.9rem' }}>
          Persisted in your browser's LocalStorage. Reload the page anytime — your list stays intact!
        </p>
      </div>

      {/* अगर वॉचलिस्ट खाली है */}
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#141922', borderRadius: '12px' }}>
          <Heart size={48} color="#64748b" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Your Watchlist is Empty</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '0.92rem' }}>
            Click the heart icon on any movie card in the Discover section to save it here.
          </p>
          <NavLink
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#e50914',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <Compass size={18} />
            <span>Discover Movies</span>
          </NavLink>
        </div>
      ) : (
        /* अगर फ़िल्में हैं, तो उन्हें ग्रिड में दिखाओ */
        <MovieGrid
          movies={favorites}
          isLoading={false}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
};