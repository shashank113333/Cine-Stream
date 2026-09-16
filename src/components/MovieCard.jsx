import React, { useState } from 'react';
import { Heart, Star, Film } from 'lucide-react';
import { getPosterUrl } from '../api/tmdb';

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  // अगर इमेज लोड होने में कोई एरर आए तो फॉलबैक दिखाने के लिए स्टेट
  const [imgError, setImgError] = useState(false);
  const posterUrl = getPosterUrl(movie.poster_path);

  // 1. तारीख में से सिर्फ साल (Year) निकालना (उदा: 2024)
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear() || movie.release_date.substring(0, 4)
    : 'N/A';

  // 2. रेटिंग को 1 डेसीमल में फॉर्मेट करना (उदा: 8.4)
  const rating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : 'NR';

  // 3. दिल (Heart) बटन पर क्लिक हैंडलर
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <div className="movie-card">
      {/* पोस्टर कंटेनर */}
      <div className="poster-container">
        {posterUrl && !imgError ? (
          /* Phase 3 Requirement: Native Lazy Loading */
          <img
            src={posterUrl}
            alt={movie.title || 'Movie Poster'}
            loading="lazy"
            decoding="async"
            className="movie-poster"
            onError={() => setImgError(true)}
          />
        ) : (
          /* FAQ #12: पोस्टर न होने पर ग्रेसफुल फॉलबैक बॉक्स */
          <div className="fallback-poster" aria-label="Poster not available">
            <Film size={36} className="fallback-icon" />
            <span className="fallback-title">{movie.title}</span>
            <span className="fallback-text">No Poster Available</span>
          </div>
        )}

        {/* Phase 2 Requirement: दिल (Heart) का बटन */}
        <button
          onClick={handleFavoriteClick}
          className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart
            size={20}
            className={`heart-icon ${isFavorite ? 'heart-filled' : ''}`}
          />
        </button>

        {/* रेटिंग बैज */}
        <div className="rating-badge">
          <Star size={13} className="star-icon" />
          <span>{rating}</span>
        </div>
      </div>

      {/* मूवी की जानकारी (Title & Meta) */}
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <div className="movie-meta">
          <span className="movie-year">{releaseYear}</span>
          <span className="media-type-badge">MOVIE</span>
        </div>
      </div>
    </div>
  );
};
