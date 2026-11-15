
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Film,
} from "lucide-react";

import Navbar from "../components/Navbar";
import "../App.css";

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

        <section className="api-feedback" aria-live="polite">
          <h2>Booking history is not connected yet</h2>
          <p>
            Your account bookings will appear here after secure sign-in and
            ownership-checked booking history are available.
          </p>
          <p>Signed in successfully. Booking history will be connected after the secure booking API is ready.</p>
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
