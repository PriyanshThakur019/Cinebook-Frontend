
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Ticket,
  Sparkles,
} from "lucide-react";

import heroImage from "../assets/hero.png";
import { getApiErrorMessage } from "../api/axiosConfig";
import {
  formatShowDateTime,
  formatShowTime,
  getFutureListedShows,
} from "../api/showApi";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import "../App.css";

function Home() {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [requestState, setRequestState] = useState({ status: "loading", error: "" });

  const loadShows = async () => {
    try {
      const listedShows = await getFutureListedShows();
      setShows(listedShows);
      setRequestState({ status: "success", error: "" });
    } catch (error) {
      setRequestState({ status: "error", error: getApiErrorMessage(error) });
    }
  };

  const retryLoadingShows = () => {
    setRequestState({ status: "loading", error: "" });
    loadShows();
  };

  useEffect(() => {
    let active = true;

    getFutureListedShows()
      .then((listedShows) => {
        if (!active) return;

        setShows(listedShows);
        setRequestState({ status: "success", error: "" });
      })
      .catch((error) => {
        if (active) {
          setRequestState({ status: "error", error: getApiErrorMessage(error) });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredShow = shows[0];
  const featuredDate = formatShowDateTime(featuredShow?.startsAt, {
    weekday: "short",
    year: "numeric",
  });

  return (
    <div className="app-shell" id="home">
      <Navbar />

      <main>
        <section className="hero">
          <div
            className="hero-backdrop"
            style={{ backgroundImage: `url(${featuredShow?.image || heroImage})` }}
          />

          <div className="hero-shade" />

          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={14} />
              EXPERIENCE CINEMA DIFFERENTLY
            </div>

            <p className="featured-label">
              {requestState.status === "loading"
                ? "CONNECTING TO SHOWTIMES"
                : featuredShow
                  ? "NEXT LISTED SCREENING"
                  : "CINEBOOK SHOWTIMES"}
            </p>
            <h1>{featuredShow?.title || "Your next movie night"}</h1>

            {featuredShow ? (
              <>
                <div className="hero-tags">
                  {featuredDate && <span>{featuredDate}</span>}
                  {featuredShow.durationMinutes && (
                    <span>{featuredShow.durationMinutes} min</span>
                  )}
                </div>
                <p className="hero-description">
                  A listed screening from {featuredShow.host}.
                </p>
              </>
            ) : (
              <p className="hero-description">
                {requestState.status === "loading"
                  ? "Loading current screenings from Cinebook."
                  : requestState.status === "error"
                    ? requestState.error
                    : "There are no future listed screenings right now. Please check back soon."}
              </p>
            )}

            <div className="hero-buttons">
              {featuredShow ? (
                <button
                  className="primary-button"
                  onClick={() => navigate(`/movie/${featuredShow.id}`)}
                >
                  <Ticket size={18} />
                  View Screening
                  <ArrowRight size={17} />
                </button>
              ) : requestState.status === "error" ? (
                <button className="secondary-button" onClick={retryLoadingShows}>
                  Try Again <ArrowRight size={17} />
                </button>
              ) : null}

            </div>

            {featuredShow?.endsAt && (
              <p className="hero-quote">
                Screening ends {formatShowTime(featuredShow.endsAt)}
              </p>
            )}
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
                Upcoming Shows<span>.</span>
              </h2>

              <p className="section-description">Scheduled screenings across Pune</p>
            </div>

          </div>

          {requestState.status === "loading" ? (
            <p className="api-feedback" role="status">Loading listed screenings…</p>
          ) : requestState.status === "error" ? (
            <div className="api-feedback api-feedback-error" role="alert">
              <p>{requestState.error}</p>
              <button className="secondary-button" onClick={retryLoadingShows}>Try Again</button>
            </div>
          ) : shows.length > 0 ? (
            <div className="movie-grid">
              {shows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => navigate(`/movie/${show.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      navigate(`/movie/${show.id}`);
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <MovieCard movie={show} />
                </div>
              ))}
            </div>
          ) : (
            <p className="api-feedback" role="status">
              No future listed screenings are available right now.
            </p>
          )}
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
