
import { Star, Clock3, ArrowUpRight } from "lucide-react";

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.image}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="poster-overlay">
          <button className="quick-book-button">
            Book Tickets <ArrowUpRight size={16} />
          </button>
        </div>

        <span className="movie-rating">
          <Star size={13} fill="currentColor" />
          {movie.rating}
        </span>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.genre}</p>

        <div className="movie-meta">
          <span><Clock3 size={13} /> {movie.duration}</span>
          <span>{movie.language}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
