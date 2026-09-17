import { NavLink } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

export const Navbar = ({ favoritesCount = 0 }) => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">

        <NavLink to="/" className="navbar-logo" aria-label="Cine-Stream Home">
          <Film size={22} color="#e50914" />
          <span className="navbar-logo-text">
            CINE<span style={{ color: '#ff4d4f' }}>STREAM</span>
          </span>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            aria-label="Discover Movies"
            className="nav-link-item"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}
          >
            Discover
          </NavLink>

          <NavLink
            to="/favorites"
            aria-label="Favorite Movies"
            className="nav-link-item"
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}
          >
            <Heart size={15} color="#e50914" fill={favoritesCount > 0 ? '#e50914' : 'none'} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span
                style={{
                  backgroundColor: '#e50914',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  marginLeft: '2px',
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