import React from 'react';
import { MovieCard } from './MovieCard';
import { Film } from 'lucide-react';

export const MovieGrid = ({
  movies = [],
  isLoading = false,
  isFavorite,
  onToggleFavorite,
  emptyMessage = 'No movies found.',
}) => {
  // अगर कोई मूवी नहीं मिली (Empty State)
  if (!isLoading && movies.length === 0) {
    return (
      <div className="empty-grid-state">
        <div className="empty-icon-box">
          <Film size={48} className="empty-icon" />
        </div>
        <h3 className="empty-title">Nothing to Show</h3>
        <p className="empty-subtitle">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={`${movie.id}-${index}`}
          movie={movie}
          isFavorite={isFavorite ? isFavorite(movie.id) : false}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};