import { useState } from 'react';
import { Heart, Star, Film } from 'lucide-react';
import { getPosterUrl } from '../api/tmdb';
export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {

  const [imgError, setImgError] = useState(false);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear() || movie.release_date.substring(0, 4)
    : 'N/A';

  
  const rating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : 'NR';
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <div className="movie-card">

      <div className="poster-container">
        {posterUrl && !imgError ? (

          <img
            src={posterUrl}
            alt={movie.title || 'Movie Poster'}
            loading="lazy"
            decoding="async"
            className="movie-poster"
            onError={() => setImgError(true)}
          />
        ) : (

          <div className="fallback-poster" aria-label="Poster not available">
            <Film size={36} className="fallback-icon" />
            <span className="fallback-title">{movie.title}</span>
            <span className="fallback-text">No Poster Available</span>
          </div>
        )}
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

        <div className="rating-badge">
          <Star size={13} className="star-icon" />
          <span>{rating}</span>
        </div>
      </div>

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
