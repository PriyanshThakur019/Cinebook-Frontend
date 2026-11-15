
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  CalendarDays,
  Clock3,
} from "lucide-react";

import heroImage from "../assets/hero.png";
import { getApiErrorMessage } from "../api/axiosConfig";
import { formatShowDateTime, formatShowTime, getListedShows } from "../api/showApi";
import { getTheatresForShow } from "../api/theatreApi";
import Navbar from "../components/Navbar";
import "../App.css";

function TheatreSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [show, setShow] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [requestState, setRequestState] = useState({ status: "loading", error: "" });

  useEffect(() => {
    let active = true;

    async function loadScreening() {
      setRequestState({ status: "loading", error: "" });

      try {
        const shows = await getListedShows();
        const matchingShow = shows.find((item) => item.id === Number(movieId));

        if (!active) return;

        if (!matchingShow) {
          setShow(null);
          setTheatres([]);
          setRequestState({ status: "not-found", error: "" });
          return;
        }

        setShow(matchingShow);

        if (Date.parse(matchingShow.startsAt) <= Date.now()) {
          setTheatres([]);
          setRequestState({ status: "past", error: "" });
          return;
        }

        const matchingTheatres = await getTheatresForShow(matchingShow.id, "Pune");

        if (active) {
          setTheatres(matchingTheatres);
          setRequestState({ status: "success", error: "" });
        }
      } catch (error) {
        if (active) {
          setRequestState({ status: "error", error: getApiErrorMessage(error) });
        }
      }
    }

    loadScreening();

    return () => {
      active = false;
    };
  }, [movieId, reloadKey]);

  const startLabel = show && formatShowDateTime(show.startsAt, {
    weekday: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="app-shell">
      <Navbar />

      <main className="theatre-page">
        <button className="back-button" onClick={() => navigate(`/movie/${movieId}`)}>
          <ArrowLeft size={17} /> Back to Screening
        </button>

        {requestState.status === "loading" ? (
          <p className="api-feedback" role="status">Loading theatre and screening details…</p>
        ) : requestState.status === "error" ? (
          <div className="api-feedback api-feedback-error" role="alert">
            <p>{requestState.error}</p>
            <button
              className="secondary-button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try Again
            </button>
          </div>
        ) : requestState.status === "not-found" ? (
          <div className="api-feedback" role="status">
            <h1>Screening not found</h1>
            <p>This screening is not listed by the backend.</p>
          </div>
        ) : requestState.status === "past" ? (
          <div className="api-feedback" role="status">
            <h1>This screening has passed</h1>
            <p>{startLabel || "The scheduled screening time is in the past."}</p>
          </div>
        ) : (
          <>
            <section className="booking-movie-summary">
              <img src={show.image || heroImage} alt={show.title} />
              <div>
                <span className="details-label">SCHEDULED SCREENING</span>
                <h1>{show.title}</h1>
                <p>
                  {show.durationMinutes ? `${show.durationMinutes} min` : "Runtime unavailable"}
                  {show.host ? ` · ${show.host}` : ""}
                </p>
              </div>
            </section>

            <section className="date-selection">
              <div className="booking-section-heading">
                <div>
                  <p className="section-kicker">SCREENING TIME</p>
                  <h2>{startLabel || "Schedule unavailable"}</h2>
                </div>
                <CalendarDays size={22} />
              </div>
              <p className="section-description">
                Date and time come from the selected backend show and cannot be changed here.
              </p>
            </section>

            <section className="theatres-section">
              <div className="booking-section-heading">
                <div>
                  <p className="section-kicker">ASSIGNED VENUE</p>
                  <h2>Select a theatre<span>.</span></h2>
                </div>
                <span className="theatre-city">
                  <MapPin size={15} /> Pune
                </span>
              </div>

              {theatres.length === 0 ? (
                <p className="api-feedback" role="status">
                  No active theatre is mapped to this screening.
                </p>
              ) : (
                <div className="theatre-list">
                  {theatres.map((theatre) => (
                    <article
                      className="theatre-card"
                      key={`${theatre.theatreDetailId}-${theatre.hall.hallDetailsId}`}
                    >
                      <div className="theatre-info">
                        <h3>{theatre.theatreName}</h3>
                        <p className="theatre-location">
                          <MapPin size={14} /> {theatre.theatreAddress}
                        </p>
                        <div className="theatre-tags">
                          <span>{theatre.hall.hallName}</span>
                          <span>{theatre.hall.hallType}</span>
                          <span>{theatre.hall.hallCapacity} seats</span>
                        </div>
                      </div>

                      <div className="theatre-shows">
                        <p><Clock3 size={14} /> {startLabel}</p>
                        <button
                          className="showtime-button"
                          onClick={() => {
                            const context = new URLSearchParams({
                              movieId: String(show.id),
                              movieTitle: show.title,
                              theatreId: String(theatre.theatreDetailId),
                              hallId: String(theatre.hall.hallDetailsId),
                              theatre: theatre.theatreName,
                              location: theatre.theatreAddress,
                              date: show.startsAt.slice(0, 10),
                              time: formatShowTime(show.startsAt) || "Time unavailable",
                            });

                            navigate(`/seats/${show.id}?${context.toString()}`);
                          }}
                        >
                          View Seat Layout <ArrowRight size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <p className="api-feedback">
              Seat availability and booking are not provided by the current backend read APIs.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default TheatreSelection;
