
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Ticket,
  MapPin,
  UserRound,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/#home" className="logo">
          <Ticket size={25} strokeWidth={2.5} />
          <span>cine<span className="logo-highlight">book</span></span>
        </Link>

        <div id="primary-navigation" className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/#home" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/#movies" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link to="/#coming-soon" onClick={() => setMenuOpen(false)}>Coming Soon</Link>
          <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
        </div>

        <div className="navbar-actions">
          <div className="location-selector">
            <MapPin size={16} />
            <span>Pune</span>
          </div>

          <Link to="/login" className="signin-button">
            <UserRound size={17} />
            <span>Sign In</span>
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
