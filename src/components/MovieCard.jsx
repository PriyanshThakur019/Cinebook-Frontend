
import { Star, Clock3, ArrowUpRight } from "lucide-react";
import fallbackPoster from "../assets/hero.png";
import { formatShowDateTime } from "../api/showApi";

function MovieCard({ movie }) {
  const duration = movie.duration || (
    movie.durationMinutes ? `${movie.durationMinutes} min` : null
  );
  const showtime = formatShowDateTime(movie.startsAt);

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.image || fallbackPoster}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="poster-overlay">
          <button className="quick-book-button">
            Book Tickets <ArrowUpRight size={16} />
          </button>
        </div>

        {movie.rating && (
          <span className="movie-rating">
            <Star size={13} fill="currentColor" />
            {movie.rating}
          </span>
        )}
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.genre || (movie.host ? `Presented by ${movie.host}` : "Scheduled screening")}</p>

        <div className="movie-meta">
          {duration && <span><Clock3 size={13} /> {duration}</span>}
          <span>{showtime || movie.language || "Show details"}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
