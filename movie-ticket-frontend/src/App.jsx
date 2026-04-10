import { Link, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MoviesPage from "./pages/MoviesPage";
import ShowtimesPage from "./pages/ShowtimesPage";
import SeatsPage from "./pages/SeatsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import AdminMoviesPage from "./pages/AdminMoviesPage";
import AdminShowtimesPage from "./pages/AdminShowtimesPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import "./App.css";

function App() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    const isAdmin = email === "admin@test.com";

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");
        navigate("/");
    }

    return (
        <div className="app-shell">
            <header className="hero-banner">
                <div className="hero-overlay">
                    <h1 className="hero-title">Movie Ticket Reservation System</h1>
                </div>
            </header>

            <nav className="top-nav">
                <div className="top-nav-inner">
                    <div className="nav-links">
                        <Link className="nav-link" to="/">
                            Login
                        </Link>
                        <Link className="nav-link" to="/register">
                            Register
                        </Link>
                        <Link className="nav-link" to="/movies">
                            Movies
                        </Link>
                        <Link className="nav-link" to="/reservations/my">
                            My Reservations
                        </Link>

                        {isAdmin && (
                            <>
                                <Link className="nav-link" to="/admin/movies">
                                    Admin Movies
                                </Link>
                                <Link className="nav-link" to="/admin/showtimes">
                                    Admin Showtimes
                                </Link>
                                <Link className="nav-link" to="/admin/reservations">
                                    Admin Reservations
                                </Link>
                            </>
                        )}
                    </div>

                    {token && (
                        <div className="user-actions">
              <span className="user-fullname">
                {fullName ? fullName : email}
              </span>

                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="page-content">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/movies"
                        element={
                            <ProtectedRoute>
                                <MoviesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/movies/:movieId/showtimes"
                        element={
                            <ProtectedRoute>
                                <ShowtimesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/movies/:movieId/showtimes/:showtimeId/seats"
                        element={
                            <ProtectedRoute>
                                <SeatsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reservations/my"
                        element={
                            <ProtectedRoute>
                                <MyReservationsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/movies"
                        element={
                            <AdminRoute>
                                <AdminMoviesPage />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/showtimes"
                        element={
                            <AdminRoute>
                                <AdminShowtimesPage />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/reservations"
                        element={
                            <AdminRoute>
                                <AdminReservationsPage />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;