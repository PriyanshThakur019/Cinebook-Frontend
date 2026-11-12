
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock3,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { movies } from "../data/movies";
import "../App.css";

const theatres = [
  {
    id: 1,
    name: "PVR Phoenix",
    location: "Phoenix Marketcity, Viman Nagar",
    rating: "4.5",
    formats: ["IMAX", "4K", "Dolby Atmos"],
    shows: ["10:30 AM", "1:45 PM", "6:30 PM", "9:45 PM"],
  },
  {
    id: 2,
    name: "INOX Bund Garden",
    location: "Bund Garden Road, Pune",
    rating: "4.3",
    formats: ["4K", "Dolby Atmos"],
    shows: ["11:00 AM", "2:15 PM", "5:45 PM", "9:15 PM"],
  },
  {
    id: 3,
    name: "Cinepolis Westend",
    location: "Westend Mall, Aundh",
    rating: "4.2",
    formats: ["4K", "Dolby Atmos"],
    shows: ["10:15 AM", "1:30 PM", "6:00 PM", "9:30 PM"],
  },
];

function TheatreSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const movie = movies.find(
    (item) => item.id === Number(movieId)
  );

  const dates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      isoDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
    };
  });
  const selectedDateIndex = Math.max(
    0,
    dates.findIndex((date) => date.isoDate === searchParams.get("date"))
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

      <main className="theatre-page">
        <button
          className="back-button"
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          <ArrowLeft size={17} /> Back to Movie
        </button>

        <section className="booking-movie-summary">
          <img src={movie.image} alt={movie.title} />

          <div>
            <span className="details-label">BOOK YOUR TICKETS</span>
            <h1>{movie.title}</h1>
            <p>{movie.genre} · {movie.duration} · {movie.language}</p>
          </div>
        </section>

        <section className="date-selection">
          <div className="booking-section-heading">
            <div>
              <p className="section-kicker">SELECT A DATE</p>
              <h2>Choose your date<span>.</span></h2>
            </div>
            <CalendarDays size={22} />
          </div>

          <div className="date-list">
            {dates.map((date, index) => (
              <button
                key={date.isoDate}
                className={`date-option ${selectedDateIndex === index ? "selected" : ""}`}
                onClick={() => {
                  const updatedParams = new URLSearchParams(searchParams);
                  updatedParams.set("date", date.isoDate);
                  setSearchParams(updatedParams, { replace: true });
                }}
                aria-pressed={selectedDateIndex === index}
              >
                <span>{date.day}</span>
                <strong>{date.date}</strong>
                <span>{date.month}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="theatres-section">
          <div className="booking-section-heading">
            <div>
              <p className="section-kicker">CINEMAS NEAR YOU</p>
              <h2>Select a theatre<span>.</span></h2>
            </div>
            <span className="theatre-city">
              <MapPin size={15} /> Pune
            </span>
          </div>

          <div className="theatre-list">
            {theatres.map((theatre) => (
              <article className="theatre-card" key={theatre.id}>
                <div className="theatre-info">
                  <h3>{theatre.name}</h3>

                  <p className="theatre-location">
                    <MapPin size={14} />
                    {theatre.location}
                  </p>

                  <div className="theatre-tags">
                    {theatre.formats.map((format) => (
                      <span key={format}>{format}</span>
                    ))}
                  </div>
                </div>

                <div className="theatre-rating">
                  <Star size={14} fill="currentColor" />
                  {theatre.rating}
                </div>

                <div className="theatre-shows">
                  <p><Clock3 size={14} /> Available showtimes</p>

                  <div className="showtime-list">
                    {theatre.shows.map((time, index) => (
                      <button
                        key={time}
                        className="showtime-button"
                        onClick={() => {
                          const showId = theatre.id * 100 + index + 1;
                          const bookingContext = new URLSearchParams({
                            movieId: String(movie.id),
                            theatreId: String(theatre.id),
                            theatre: theatre.name,
                            location: theatre.location,
                            date: dates[selectedDateIndex].isoDate,
                            time,
                          });

                          navigate(`/seats/${showId}?${bookingContext.toString()}`);
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default TheatreSelection;
