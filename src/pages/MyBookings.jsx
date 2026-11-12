
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  CalendarDays,
  Clock3,
  MapPin,
  Armchair,
  ArrowRight,
  Film,
} from "lucide-react";

import Navbar from "../components/Navbar";
import "../App.css";

const bookings = [
  {
    id: "CB1001",
    movie: "Interstellar",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    theatre: "PVR Phoenix",
    location: "Phoenix Marketcity, Pune",
    date: "15 Nov 2026",
    time: "6:30 PM",
    seats: ["A5", "A6"],
    amount: 500,
    status: "Upcoming",
  },
  {
    id: "CB1002",
    movie: "Oppenheimer",
    image: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    theatre: "INOX Bund Garden",
    location: "Bund Garden Road, Pune",
    date: "02 Nov 2026",
    time: "3:15 PM",
    seats: ["B4", "B5"],
    amount: 500,
    status: "Completed",
  },
];

function MyBookings() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Navbar />

      <main className="my-bookings-page">
        <div className="bookings-heading">
          <div>
            <p className="section-kicker">YOUR CINEMA JOURNEY</p>
            <h1>My Bookings<span>.</span></h1>
            <p>All your movie plans, in one place.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            <Film size={17} />
            Book a Movie
          </button>
        </div>

        <div className="booking-stats">
          <div className="booking-stat">
            <Ticket size={20} />
            <div>
              <strong>{bookings.length}</strong>
              <span>Total Bookings</span>
            </div>
          </div>

          <div className="booking-stat">
            <CalendarDays size={20} />
            <div>
              <strong>
                {bookings.filter((booking) => booking.status === "Upcoming").length}
              </strong>
              <span>Upcoming Shows</span>
            </div>
          </div>

          <div className="booking-stat">
            <Clock3 size={20} />
            <div>
              <strong>
                {bookings.filter((booking) => booking.status === "Completed").length}
              </strong>
              <span>Watched Movies</span>
            </div>
          </div>
        </div>

        <section className="bookings-list-section">
          <div className="booking-list-heading">
            <h2>Your Tickets</h2>
            <span>{bookings.length} bookings</span>
          </div>

          <div className="booking-cards">
            {bookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <img
                  className="booking-poster"
                  src={booking.image}
                  alt={booking.movie}
                />

                <div className="booking-details">
                  <div className="booking-title-row">
                    <h3>{booking.movie}</h3>

                    <span
                      className={`booking-status ${
                        booking.status === "Upcoming"
                          ? "upcoming"
                          : "completed"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="booking-theatre">
                    {booking.theatre}
                  </p>

                  <div className="booking-meta">
                    <span><MapPin size={14} /> {booking.location}</span>
                    <span><CalendarDays size={14} /> {booking.date}</span>
                    <span><Clock3 size={14} /> {booking.time}</span>
                    <span><Armchair size={14} /> {booking.seats.join(", ")}</span>
                  </div>

                  <div className="booking-bottom">
                    <span>Booking ID: {booking.id}</span>
                    <strong>₹{booking.amount}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="booking-help">
          <div>
            <h3>Looking for your next movie?</h3>
            <p>Discover what's playing and plan your next cinema experience.</p>
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Explore Movies <ArrowRight size={17} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default MyBookings;
