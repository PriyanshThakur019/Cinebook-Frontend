
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Ticket,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { movies, featuredMovie } from "../data/movies";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-shell" id="home">
      <Navbar />

      <main>
        <section className="hero">
          <div
            className="hero-backdrop"
            style={{ backgroundImage: `url(${featuredMovie.image})` }}
          />

          <div className="hero-shade" />

          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={14} />
              EXPERIENCE CINEMA DIFFERENTLY
            </div>

            <p className="featured-label">FEATURED MOVIE</p>
            <h1>{featuredMovie.title}</h1>

            <div className="hero-tags">
              <span>2014</span>
              <span>Sci-Fi</span>
              <span>Adventure</span>
              <span>IMAX</span>
            </div>

            <p className="hero-description">
              {featuredMovie.description}
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => navigate("/movie/1")}
              >
                <Ticket size={18} />
                Book Tickets
                <ArrowRight size={17} />
              </button>

            </div>

            <p className="hero-quote">
              "{featuredMovie.subtitle}"
            </p>
          </div>

          <div className="hero-counter">
            <span className="counter-active">01</span>
            <span className="counter-line" />
            <span>03</span>
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="section-kicker">
                FIND YOUR NEXT FAVOURITE
              </p>

              <h2>
                Now Showing<span>.</span>
              </h2>

              <p className="section-description">
                The biggest stories. The biggest screen.
              </p>
            </div>

          </div>

          <div className="movie-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        <section className="coming-section" id="coming-soon">
          <div>
            <p className="section-kicker">MARK YOUR CALENDAR</p>
            <h2>
              Coming Soon<span>.</span>
            </h2>
            <p>Upcoming titles will appear here when schedules are available.</p>
          </div>
        </section>
      </main>

      <footer id="about" className="footer">
        <a href="/" className="logo">
          <Ticket size={22} />
          <span>cine<span className="logo-highlight">book</span></span>
        </a>

        <p>Made for people who love the magic of cinema.</p>
        <span>© 2026 Cinebook. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Home;
