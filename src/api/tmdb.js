import axios from 'axios';

// 1. .env से OMDb और TMDB की Keys पढ़ना
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY?.trim() || 'df009f39';
const OMDB_BASE_URL = 'https://www.omdbapi.com';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 2. FAQ #4 और FAQ #12: पोस्टर इमेज URL हेल्पर
export const getPosterUrl = (posterPath) => {
  if (!posterPath || posterPath === 'N/A') return null; // FAQ #12: मिसिंग पोस्टर पर फॉलबैक
  if (posterPath.startsWith('http')) return posterPath; // FAQ #4: OMDb सीधा फुल इमेज URL देता है
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

// OMDb डेटा को हमारे ऐप के फॉर्मेट में बदलना
const formatOmdbMovie = (item) => ({
  id: item.imdbID,
  title: item.Title,
  release_date: item.Year,
  poster_path: item.Poster && item.Poster !== 'N/A' ? item.Poster : null,
  vote_average: 8.2, // डिफ़ॉल्ट रेटिंग
});

// =========================================================================
// 3. लोकप्रिय फ़िल्में लोड करना (Popular Movies - Live OMDb)
// =========================================================================
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: 'Marvel', // डिफ़ॉल्ट लोकप्रिय कलेक्शन
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

// =========================================================================
// 4. लाइव सर्च करना (Search Endpoint - 500ms Debounced)
// =========================================================================
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