
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  CalendarDays,
  Clock3,
  Film,
  MapPin,
  Ticket,
  Info,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { movies } from "../data/movies";
import "../App.css";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 10;

const bookedSeats = ["A3", "A4", "B7", "C2", "C3", "D8", "E5", "F6"];

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const seatPrice = 250;
  const movie = movies.find(
    (item) => item.id === Number(searchParams.get("movieId"))
  );
  const selectedDateValue = searchParams.get("date");
  const selectedDate = selectedDateValue
    ? new Date(`${selectedDateValue}T00:00:00`)
    : null;
  const dateLabel = selectedDate && !Number.isNaN(selectedDate.getTime())
    ? selectedDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date not selected";
  const selectedSeats = [...new Set(
    (searchParams.get("seats") || "")
      .split(",")
      .filter((seatId) => {
        const row = seatId.slice(0, 1);
        const seatNumber = Number(seatId.slice(1));

        return (
          ROWS.includes(row) &&
          Number.isInteger(seatNumber) &&
          seatNumber >= 1 &&
          seatNumber <= SEATS_PER_ROW &&
          !bookedSeats.includes(seatId)
        );
      })
  )];

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    const updatedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((seat) => seat !== seatId)
      : [...selectedSeats, seatId];
    const updatedParams = new URLSearchParams(searchParams);

    if (updatedSeats.length > 0) {
      updatedParams.set("seats", updatedSeats.join(","));
    } else {
      updatedParams.delete("seats");
    }

    setSearchParams(updatedParams, { replace: true });
  };

  const totalAmount = selectedSeats.length * seatPrice;

  return (
    <div className="app-shell">
      <Navbar />

      <main className="seat-page">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} /> Back to Shows
        </button>

        <div className="seat-page-heading">
          <div>
            <p className="section-kicker">ALMOST THERE</p>
            <h1>Select Your Seats<span>.</span></h1>
            <p>Choose your preferred seats. This sample selection does not reserve seats.</p>
          </div>

          <div className="show-summary">
            <span><Film size={16} /> {movie?.title || "Movie not selected"}</span>
            <span><MapPin size={16} /> {searchParams.get("theatre") || "Theatre not selected"}</span>
            <span><CalendarDays size={16} /> {dateLabel}</span>
            <span><Clock3 size={16} /> {searchParams.get("time") || "Showtime not selected"}</span>
            <span><Ticket size={16} /> Demo show {showId}</span>
          </div>
        </div>

        <section className="seat-layout">
          <div className="screen-container">
            <div className="screen-curve" />
            <span>SCREEN THIS WAY</span>
          </div>

          <div className="seat-grid">
            {ROWS.map((row) => (
              <div className="seat-row" key={row}>
                <span className="row-label">{row}</span>

                {Array.from(
                  { length: SEATS_PER_ROW },
                  (_, index) => {
                    const seatId = `${row}${index + 1}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        className={`seat ${
                          isBooked
                            ? "booked"
                            : isSelected
                              ? "selected"
                              : "available"
                        }`}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        title={seatId}
                        aria-label={`Seat ${seatId}`}
                      >
                        <Armchair size={17} />
                      </button>
                    );
                  }
                )}

                <span className="row-label">{row}</span>
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div><span className="legend-seat available-legend" /> Available</div>
            <div><span className="legend-seat selected-legend" /> Selected</div>
            <div><span className="legend-seat booked-legend" /> Booked</div>
          </div>

          <div className="seat-price-info">
            <Info size={15} />
            Sample price: ₹{seatPrice} per seat. Seats are not reserved.
          </div>
        </section>

        <section className="booking-summary">
          <div>
            <p className="summary-label">SELECTED SEATS</p>
            <h3>
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "No seats selected"}
            </h3>
          </div>

          <div className="summary-total">
            <p className="summary-label">TOTAL AMOUNT</p>
            <h2>₹{totalAmount}</h2>
          </div>

          <button
            className="primary-button"
            disabled={selectedSeats.length === 0}
            onClick={() => navigate({
              pathname: "/login",
              search: searchParams.toString(),
            })}
          >
            Continue <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default SeatSelection;
