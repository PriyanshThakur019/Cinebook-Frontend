
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Ticket,
  UserRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import { movies } from "../data/movies";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const movie = movies.find(
    (item) => item.id === Number(searchParams.get("movieId"))
  );
  const selectedSeats = (searchParams.get("seats") || "")
    .split(",")
    .filter(Boolean);
  const bookingDateValue = searchParams.get("date");
  const bookingDate = bookingDateValue
    ? new Date(`${bookingDateValue}T00:00:00`)
    : null;
  const bookingDateLabel = bookingDate && !Number.isNaN(bookingDate.getTime())
    ? bookingDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date not selected";

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Backend authentication will be integrated later.
    alert("Login API integration is coming next!");
  };

  return (
    <div className="auth-page">
      <div className="auth-background" />

      <button
        className="auth-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} /> Back
      </button>

      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <Ticket size={27} />
          cine<span>book</span>
        </Link>

        <div className="auth-heading">
          <p className="section-kicker">WELCOME BACK</p>
          <h1>Sign in<span>.</span></h1>
          <p>Continue your cinematic journey.</p>
        </div>

        {selectedSeats.length > 0 && (
          <section className="pending-booking-context" aria-label="Pending booking selection">
            <div className="pending-booking-title">
              <p className="section-kicker">YOUR SELECTION</p>
              <h2>{movie?.title || "Movie selection"}</h2>
            </div>
            <div className="pending-booking-details">
              <span><MapPin size={14} /> {searchParams.get("theatre") || "Theatre not selected"}</span>
              <span><CalendarDays size={14} /> {bookingDateLabel}</span>
              <span><Clock3 size={14} /> {searchParams.get("time") || "Showtime not selected"}</span>
              <span>Seats: {selectedSeats.join(", ")}</span>
              <span>Estimated total: ₹{selectedSeats.length * 250}</span>
            </div>
            <p className="pending-booking-note">
              These sample selections are not reserved. Sign-in and booking are not connected yet.
            </p>
          </section>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username">Username</label>

          <div className="auth-input-wrapper">
            <UserRound size={18} />
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="auth-input-wrapper">
            <Lock size={18} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="auth-options">
            <label className="remember-option">
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="primary-button auth-submit">
            Sign In <ArrowRight size={17} />
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?
          <Link to="/register"> Create account</Link>
        </p>

        <p className="auth-footer">
          By continuing, you agree to Cinebook's Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Login;
