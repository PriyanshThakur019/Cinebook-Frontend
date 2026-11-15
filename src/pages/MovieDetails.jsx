
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  CalendarDays,
  Ticket,
} from "lucide-react";

import heroImage from "../assets/hero.png";
import { getApiErrorMessage } from "../api/axiosConfig";
import { formatShowDateTime, getListedShows } from "../api/showApi";
import Navbar from "../components/Navbar";
import "../App.css";

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [show, setShow] = useState(null);
  const [canContinue, setCanContinue] = useState(false);
  const [requestState, setRequestState] = useState({ status: "loading", error: "" });

  useEffect(() => {
    let active = true;

    async function loadShow() {
      setRequestState({ status: "loading", error: "" });

      try {
        const shows = await getListedShows();
        const matchingShow = shows.find((item) => item.id === Number(movieId));

        if (!active) return;

        if (!matchingShow) {
          setShow(null);
          setRequestState({ status: "not-found", error: "" });
          return;
        }

        setShow(matchingShow);
        setCanContinue(Date.parse(matchingShow.startsAt) > Date.now());
        setRequestState({ status: "success", error: "" });
      } catch (error) {
        if (active) {
          setRequestState({ status: "error", error: getApiErrorMessage(error) });
        }
      }
    }

    loadShow();

    return () => {
      active = false;
    };
  }, [movieId, reloadKey]);

  if (requestState.status === "loading") {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <p className="api-feedback" role="status">Loading screening details…</p>
        </main>
      </div>
    );
  }

  if (requestState.status === "error" || requestState.status === "not-found") {
    const notFound = requestState.status === "not-found";

    return (
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <h2>{notFound ? "Screening not found" : "Could not load screening"}</h2>
          <p className="api-feedback" role={notFound ? "status" : "alert"}>
            {notFound
              ? "This screening is not listed by the backend."
              : requestState.error}
          </p>
          {!notFound && (
            <button
              className="secondary-button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try Again
            </button>
          )}
          <button className="primary-button" onClick={() => navigate("/")}>
            Back to Shows
          </button>
        </main>
      </div>
    );
  }

  const startLabel = formatShowDateTime(show.startsAt, {
    weekday: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const endLabel = formatShowDateTime(show.endsAt, {
    hour: "numeric",
    minute: "2-digit",
  });

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
            <img src={show.image || heroImage} alt={show.title} />
          </div>

          <div className="details-content">
            <span className="details-label">SCHEDULED SCREENING</span>

            <h1>{show.title}</h1>

            <div className="details-rating">
              <CalendarDays size={17} />
              <strong>{startLabel || "Schedule unavailable"}</strong>
            </div>

            <div className="details-meta">
              {show.durationMinutes && (
                <span><Clock3 size={15} /> {show.durationMinutes} min</span>
              )}
              <span>{show.host}</span>
              {endLabel && <span>Ends {endLabel}</span>}
            </div>

            <div className="details-description">
              <h3>About the movie</h3>
              <p>
                Screening details are provided by Cinebook. Poster, rating,
                genre, and language information are not available for this show.
              </p>
            </div>

            <div className="details-actions">
              <button
                className="primary-button"
                disabled={!canContinue}
                onClick={() => navigate(`/theatres/${show.id}`)}
              >
                <Ticket size={18} />
                {canContinue ? "Choose Theatre" : "Screening has passed"}
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
              {canContinue
                ? "View the theatre assigned to this screening. Seat availability and booking are not connected yet."
                : "This screening is in the past and can no longer be selected."}
            </p>
          </div>

          <button
            className="primary-button"
            disabled={!canContinue}
            onClick={() => navigate(`/theatres/${show.id}`)}
          >
            {canContinue ? "View Theatre" : "Screening has passed"} <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default MovieDetails;
