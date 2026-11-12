
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Clock3,
  Ticket,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { movies } from "../data/movies";
import "../App.css";

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const movie = movies.find(
    (item) => item.id === Number(movieId)
  );

  if (!movie) {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="page-container">
          <h2>Movie not found</h2>
          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="movie-details-page">
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} /> Back to Movies
        </button>

        <section className="movie-details-hero">
          <div className="details-poster">
            <img src={movie.image} alt={movie.title} />
          </div>

          <div className="details-content">
            <span className="details-label">NOW SHOWING</span>

            <h1>{movie.title}</h1>

            <div className="details-rating">
              <Star size={17} fill="currentColor" />
              <strong>{movie.rating}/10</strong>
              <span>IMDb Rating</span>
            </div>

            <div className="details-meta">
              <span><Clock3 size={15} /> {movie.duration}</span>
              <span>{movie.genre}</span>
              <span>{movie.language}</span>
            </div>

            <div className="details-description">
              <h3>About the movie</h3>
              <p>
                Experience {movie.title} on the big screen.
                Enjoy an immersive cinematic experience with
                stunning visuals and unforgettable storytelling.
              </p>
            </div>

            <div className="details-actions">
              <button
                className="primary-button"
                onClick={() => navigate(`/theatres/${movie.id}`)}
              >
                <Ticket size={18} />
                Book Tickets
                <ArrowRight size={17} />
              </button>

            </div>
          </div>
        </section>

        <section className="showtimes-preview">
          <div>
            <p className="section-kicker">YOUR CINEMA EXPERIENCE</p>
            <h2>Choose your show<span>.</span></h2>
            <p>
              Select your preferred theatre, date and showtime
              to continue booking.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate(`/theatres/${movie.id}`)}
          >
            Select Theatre <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default MovieDetails;
