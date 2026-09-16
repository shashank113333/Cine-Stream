import { useState } from 'react';
import { fetchPopularMovies, searchMovies } from '../api/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { SearchBar } from '../components/SearchBar';
import { MoodMatcher } from '../components/MoodMatcher';
import { useDebounce } from '../hooks/useDebounce';
import { Loader2, Sparkles, Compass } from 'lucide-react';

export const Home = ({ isFavorite, onToggleFavorite }) => {
  const [activeMode, setActiveMode] = useState('search');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const sentinelRef = useRef(null);

  // डेटा फेच करने का फंक्शन
  const loadData = useCallback(async (targetPage, isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let data;
      if (debouncedSearchTerm.trim()) {
        data = await searchMovies(debouncedSearchTerm, targetPage);
      } else {
        data = await fetchPopularMovies(targetPage);
      }

      setTotalPages(data.total_pages || 1);
      setPage(targetPage);

      setMovies((prev) => (isAppend ? [...prev, ...(data.results || [])] : data.results || []));
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadData(1, false);
  }, [loadData]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && !loadingMore && page < totalPages) {
          loadData(page + 1, true);
        }
      },
      { root: null, rootMargin: '150px', threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loading, loadingMore, page, totalPages, loadData]);

  const handleMovieDiscovered = (movieTitle) => {
    setSearchTerm(movieTitle);
  };

  return (
    <div className="main-viewport">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveMode('search')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: activeMode === 'search' ? '#e50914' : '#141922',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <Compass size={16} />
          <span>Manual Search</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('ai-mood')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: activeMode === 'ai-mood' ? 'linear-gradient(135deg, #8b5cf6, #c026d3)' : '#141922',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={16} />
          <span>AI Mood Matcher</span>
        </button>
      </div>

      {activeMode === 'ai-mood' ? (
        <MoodMatcher onMovieDiscovered={handleMovieDiscovered} />
      ) : (
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem' }}>
          {debouncedSearchTerm.trim()
            ? `Results for "${debouncedSearchTerm}"`
            : 'Trending & Popular Movies'}
        </h2>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Loaded: {movies.length} movies
        </span>
      </div>

      <MovieGrid
        movies={movies}
        isLoading={loading}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />

      <div ref={sentinelRef} style={{ padding: '30px 0', textAlign: 'center' }}>
        {loadingMore && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
            <Loader2 size={20} className="animate-spin" />
            <span>Loading next page into DOM...</span>
          </div>
        )}
        {!loadingMore && page >= totalPages && movies.length > 0 && (
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            ✓ You have reached the end of the collection
          </span>
        )}
      </div>
    </div>
  );
};