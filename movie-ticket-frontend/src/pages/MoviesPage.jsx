import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MoviesPage() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const response = await api.get("/movies");
                setMovies(response.data);
                setMessage("");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load movies";
                setMessage(errorMessage);
                setMovies([]);
            }
        };

        loadMovies();
    }, []);

    const handleViewShowtimes = (movieId) => {
        navigate(`/movies/${movieId}/showtimes`);
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>Movies</h1>

            {message && <p>{message}</p>}

            {movies.length === 0 ? (
                <p>No movies found</p>
            ) : (
                <div>
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "16px",
                                marginBottom: "12px",
                                borderRadius: "8px",
                            }}
                        >
                            <h3>{movie.title}</h3>
                            <p>{movie.description}</p>
                            <p>Duration: {movie.durationMinutes} minutes</p>
                            <p>Rating: {movie.rating}</p>

                            <button
                                onClick={() => handleViewShowtimes(movie.id)}
                                style={{ marginTop: "8px", padding: "8px 12px" }}
                            >
                                View Showtimes
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MoviesPage;