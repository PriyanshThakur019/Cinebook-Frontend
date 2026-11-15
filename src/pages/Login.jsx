
import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

import { formatShowDate } from "../api/showApi";
import { getApiErrorMessage } from "../api/axiosConfig";
import { useAuth } from "../context/useAuth";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const successMessage = location.state?.message || "";
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const movieTitle = searchParams.get("movieTitle");
  const selectedSeats = (searchParams.get("seats") || "")
    .split(",")
    .filter(Boolean);
  const bookingDateLabel = formatShowDate(searchParams.get("date")) || "Date not selected";

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await signIn(formData.username, formData.password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
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

        {movieTitle && (
          <section className="pending-booking-context" aria-label="Pending booking selection">
            <div className="pending-booking-title">
              <p className="section-kicker">YOUR SELECTION</p>
              <h2>{movieTitle}</h2>
            </div>
            <div className="pending-booking-details">
              <span><MapPin size={14} /> {searchParams.get("theatre") || "Theatre not selected"}</span>
              <span><CalendarDays size={14} /> {bookingDateLabel}</span>
              <span><Clock3 size={14} /> {searchParams.get("time") || "Showtime not selected"}</span>
              {selectedSeats.length > 0 && <span>Seats: {selectedSeats.join(", ")}</span>}
              {selectedSeats.length > 0 && (
                <span>Estimated sample total: ₹{selectedSeats.length * 250}</span>
              )}
            </div>
            <p className="pending-booking-note">
              This screening context is informational. Seat availability and booking are not connected yet.
            </p>
          </section>
        )}

        {successMessage && <p className="auth-message auth-message-success" role="status">{successMessage}</p>}
        {errorMessage && <p className="auth-message auth-message-error" role="alert">{errorMessage}</p>}

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
            <span className="forgot-password-disabled">Password reset coming later</span>
          </div>

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"} <ArrowRight size={17} />
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
