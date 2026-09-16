import axios from 'axios';
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY?.trim() || 'df009f39';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getPosterUrl = (posterPath) => {
  if (!posterPath || posterPath === 'N/A') return null; 
  if (posterPath.startsWith('http')) return posterPath;
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};
const formatOmdbMovie = (item) => ({
  id: item.imdbID,
  title: item.Title,
  release_date: item.Year,
  poster_path: item.Poster && item.Poster !== 'N/A' ? item.Poster : null,
  vote_average: 8.2, 
});

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: 'Marvel', 
        page,
        type: 'movie',
      },
    });

    if (response.data && response.data.Search) {
      const total = parseInt(response.data.totalResults, 10) || 10;
      return {
        page,
        results: response.data.Search.map(formatOmdbMovie),
        total_pages: Math.min(Math.ceil(total / 10), 10),
      };
    }
  } catch (err) {
    console.error('OMDb fetch error:', err);
  }

  return { page: 1, results: [], total_pages: 1 };
};

export const searchMovies = async (query, page = 1) => {
  if (!query || !query.trim()) {
    return { results: [], total_pages: 0, page: 1 };
  }

  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: query.trim(),
        page,
        type: 'movie',
      },
    });

    if (response.data && response.data.Search) {
      const total = parseInt(response.data.totalResults, 10) || 10;
      return {
        page,
        results: response.data.Search.map(formatOmdbMovie),
        total_pages: Math.min(Math.ceil(total / 10), 5),
      };
    }
  } catch (err) {
    console.error('OMDb search error:', err);
  }

  return { results: [], total_pages: 0, page: 1 };
};