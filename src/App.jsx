
import { Link, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TheatreSelection from "./pages/TheatreSelection";
import SeatSelection from "./pages/SeatSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
      <Route path="/theatres/:movieId" element={<TheatreSelection />} />
      <Route path="/seats/:showId" element={<SeatSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route
        path="*"
        element={
          <div className="app-shell">
            <Navbar />
            <main className="page-container">
              <h1>Page not found</h1>
              <p>This page does not exist.</p>
              <Link to="/" className="primary-button">Return to Cinebook</Link>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
