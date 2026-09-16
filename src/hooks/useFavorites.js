import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cine_stream_favorites';

/**
 * useFavorites Hook
 * LocalStorage के साथ सिंक रहने वाला स्टेट मैनेजमेंट
 */
export const useFavorites = () => {
  // 1. शुरू में localStorage से डेटा पढ़ो (Lazy Initialization)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('LocalStorage read error:', e);
      return [];
    }
  });

  // 2. जब भी favorites बदले, तो तुरंत localStorage में सेव कर दो
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [favorites]);

  // 3. टॉगल फंक्शन: अगर पहले से है तो हटाओ, नहीं है तो जोड़ो
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id); // Remove
      } else {
        return [...prev, movie]; // Add
      }
    });
  };

  // 4. चेक करना कि क्या कोई फ़िल्म पहले से पसंद की गई है
  const isFavorite = (movieId) => {
    return favorites.some((m) => m.id === movieId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };
};