import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Film,
  Info,
  MapPin,
  Ticket,
} from "lucide-react";

import { getApiErrorMessage } from "../api/axiosConfig";
import { formatShowDate } from "../api/showApi";
import { getSeatsForHall } from "../api/theatreApi";
import Navbar from "../components/Navbar";
import "../App.css";

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get("hallId");
  const [reloadKey, setReloadKey] = useState(0);
  const [seats, setSeats] = useState([]);
  const [requestState, setRequestState] = useState({ status: "loading", error: "" });

  useEffect(() => {
    let active = true;

    async function loadSeats() {
      if (!hallId) {
        setRequestState({
          status: "error",
          error: "The screening URL does not include a hall. Return to the show and choose its theatre.",
        });
        return;
      }

      setRequestState({ status: "loading", error: "" });

      try {
        const hallSeats = await getSeatsForHall(hallId);

        if (active) {
          setSeats(hallSeats);
          setRequestState({ status: "success", error: "" });
        }
      } catch (error) {
        if (active) {
          setRequestState({ status: "error", error: getApiErrorMessage(error) });
        }
      }
    }

    loadSeats();

    return () => {
      active = false;
    };
  }, [hallId, reloadKey]);

  const seatRows = useMemo(() => {
    const groups = new Map();

    for (const seat of seats) {
      const match = seat.seatNumber?.match(/^([A-Z]+)(\d+)$/);
      if (!match) continue;

      const [, row, seatNumber] = match;
      const rowSeats = groups.get(row) || [];
      rowSeats.push({ ...seat, numericSeatNumber: Number(seatNumber) });
      groups.set(row, rowSeats);
    }

    return [...groups.entries()]
      .sort(([firstRow], [secondRow]) => firstRow.localeCompare(secondRow))
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((firstSeat, secondSeat) =>
          firstSeat.numericSeatNumber - secondSeat.numericSeatNumber
        ),
      }));
  }, [seats]);

  const dateLabel = formatShowDate(searchParams.get("date"));
  const displayableSeatCount = seatRows.reduce(
    (count, row) => count + row.seats.length,
    0
  );

  return (
    <div className="app-shell">
      <Navbar />

      <main className="seat-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} /> Back to Screening
        </button>

        <div className="seat-page-heading">
          <div>
            <p className="section-kicker">HALL LAYOUT</p>
            <h1>Seats for this screening<span>.</span></h1>
            <p>Seat availability is not included in the current backend API.</p>
          </div>

          <div className="show-summary">
            <span><Film size={16} /> {searchParams.get("movieTitle") || `Show ${showId}`}</span>
            <span><MapPin size={16} /> {searchParams.get("theatre") || "Theatre unavailable"}</span>
            <span><CalendarDays size={16} /> {dateLabel || "Date unavailable"}</span>
            <span><Clock3 size={16} /> {searchParams.get("time") || "Time unavailable"}</span>
            <span><Ticket size={16} /> Hall {hallId || "unavailable"}</span>
          </div>
        </div>

        {requestState.status === "loading" ? (
          <p className="api-feedback" role="status">Loading hall seats…</p>
        ) : requestState.status === "error" ? (
          <div className="api-feedback api-feedback-error" role="alert">
            <p>{requestState.error}</p>
            {hallId && (
              <button
                className="secondary-button"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <>
            <section className="seat-layout" aria-label="Read-only hall seat layout">
              <div className="screen-container">
                <div className="screen-curve" />
                <span>SCREEN THIS WAY</span>
              </div>

              {seatRows.length > 0 ? (
                <div className="seat-grid">
                  {seatRows.map(({ row, seats: rowSeats }) => (
                    <div className="seat-row" key={row}>
                      <span className="row-label">{row}</span>
                      {rowSeats.map((seat) => (
                        <span
                          className="seat layout-seat"
                          key={seat.hallSeatId}
                          title={`${seat.seatType || "Seat"}; availability unknown`}
                          aria-label={`${seat.seatNumber}; availability unknown`}
                        >
                          {seat.seatNumber}
                        </span>
                      ))}
                      <span className="row-label">{row}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="api-feedback" role="status">
                  No displayable active seats were returned for this hall.
                </p>
              )}

              <div className="seat-price-info">
                <Info size={15} />
                {displayableSeatCount} of {seats.length} active seats shown. Availability and prices are not provided.
                {displayableSeatCount < seats.length && " Unsupported seat labels are omitted from this layout."}
              </div>
            </section>

            <div className="api-feedback">
              This layout is read-only. Booking is disabled until the backend can report and reserve seats per show.
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default SeatSelection;