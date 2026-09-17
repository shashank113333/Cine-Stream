# Cine-Stream — Sprint 08 AI Engineering & Prompt Documentation (`Prompts.md`)

**Student / Engineer:** Shashank Vishwakarma  
**Employee ID:** PDIT-FTE-11454  
**Project:** Cine-Stream (Media Explorer SPA)  
**Deliverable:** Sprint 08 — Performance Optimization & Client-Side Polish  


# 1. Architectural Patterns & Engineering Decisions

## 1.1 Infinite Scroll Architecture (IntersectionObserver vs Window Scroll)
**Problem Statement:** Standard pagination interrupts seamless media discovery. Window scroll event listeners fire at up to 60fps on the main thread, causing severe DOM thrashing, reflows, and memory leaks when rendering thousands of items.
**Architectural Solution:** Implemented native browser `IntersectionObserver` observing an invisible sentinel `<div>` positioned at the bottom of the DOM grid with a `rootMargin: '150px'` pre-fetch buffer.
**State Hydration:** Appended Page $N+1$ using the functional state updater form `setMovies(prev => [...prev, ...newResults])` adhering strictly to FAQ #8.

## 1.2 Input Request Throttling (500ms Debouncing)
**Problem Statement:** Unthrottled search inputs execute an HTTP request for every single keystroke. Typing "Batman" fires 6 rapid requests (B, Ba, Bat, Batm, Batma, Batman), wasting bandwidth and risking API rate limiting.
 **Architectural Solution:** Engineered a custom reusable hook `useDebounce(value, delay = 500)` utilizing `setTimeout` and cleanup via `clearTimeout`. Exactly 1 targeted request is executed 500ms after the user halts typing.

## 1.3 State Persistence (Favorites & Watchlist)
**Problem Statement:** Client-side state resets to empty upon page refresh or tab close.
**Architectural Solution:** Built a custom `useFavorites` hook with lazy initialization reading from `localStorage.getItem('cine_stream_favorites')` and a synchronized `useEffect` ensuring persistent storage across full browser hard reloads (`Ctrl + F5`), mapped to a dedicated `/favorites` route.



# 2. Phase 3: Gemini AI Mood Matcher Prompt Engineering

**Objective:** Allow users to discover films contextually using natural language and emotion strings (eg. *"Feeling sad but want high-octane action"*).
**Prompt Formulation (FAQ #7):**
  Suggest ONE movie based on this mood: "${moodText}". Return ONLY the movie title as a plaintext string,without any quotes, markdown or explanations.
  
**The Handoff Architecture:** The LLM's response is sanitized and passed into the movie search pipeline:
  "MoodMatcher -> getMovieFromMood -> searchMovies(cleanTitle) -> DOM Card Render".

# 3. Debugging Log & Root Cause Analysis (RCA)

1. **Bug:** Missing Poster Layout Shift (FAQ #12).
    **Fix:** Handled `poster_path === null` and `Poster === 'N/A'` gracefully by conditionally rendering a fallback container with film iconography and movie title, preserving the CSS grid aspect ratio (2:3).
2. **Bug:** Missing `useDebounce` import in `Home.jsx`.
    **Fix:** Resolved missing import declaration `import { useDebounce } from '../hooks/useDebounce'`.
3. **Optimization:** Native Image Asset Lazy Loading.
    **Fix:** Added native `loading="lazy"` and `decoding="async"` on all media `<img>` elements.
