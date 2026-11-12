
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Ticket,
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import "../App.css";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Backend registration will be integrated later.
    alert("Registration API integration is coming next!");
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

      <div className="auth-card register-card">
        <Link to="/" className="auth-logo">
          <Ticket size={27} />
          cine<span>book</span>
        </Link>

        <div className="auth-heading">
          <p className="section-kicker">JOIN THE EXPERIENCE</p>
          <h1>Create Account<span>.</span></h1>
          <p>Your next cinematic experience starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="fullName">Full name</label>

          <div className="auth-input-wrapper">
            <UserRound size={18} />
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="email">Email address</label>

          <div className="auth-input-wrapper">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="mobile">Mobile number</label>

          <div className="auth-input-wrapper">
            <Phone size={18} />
            <input
              id="mobile"
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
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

          <label htmlFor="confirmPassword">Confirm password</label>

          <div className="auth-input-wrapper">
            <Lock size={18} />
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="primary-button auth-submit">
            Create Account <ArrowRight size={17} />
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login"> Sign in</Link>
        </p>

        <p className="auth-footer">
          By creating an account, you agree to Cinebook's Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Register;
