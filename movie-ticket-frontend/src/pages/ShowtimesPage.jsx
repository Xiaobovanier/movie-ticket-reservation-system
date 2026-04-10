import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function ShowtimesPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [showtimes, setShowtimes] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await api.get(`/showtimes/movie/${movieId}`);
                setShowtimes(response.data);
                setMessage("");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load showtimes";
                setMessage(errorMessage);
            }
        };


        fetchShowtimes();
    }, [movieId]);

    function handleSelectSeats(showtimeId) {
        navigate(`/movies/${movieId}/showtimes/${showtimeId}/seats`);
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Showtimes</h1>

            {message && <p>{message}</p>}

            {showtimes.length === 0 ? (
                <p>No showtimes found</p>
            ) : (
                <div>
                    {showtimes.map((showtime) => (
                        <div
                            key={showtime.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "16px",
                                marginBottom: "12px",
                                borderRadius: "8px",
                            }}
                        >
                            <p><strong>Start:</strong> {showtime.startTime}</p>
                            <p><strong>End:</strong> {showtime.endTime}</p>
                            <p><strong>Price:</strong> ${showtime.price}</p>
                            <p><strong>Status:</strong> {showtime.status}</p>
                            <p><strong>Room:</strong> {showtime.room?.name}</p>

                            <button
                                onClick={() => handleSelectSeats(showtime.id)}
                                style={{ marginTop: "8px", padding: "8px 12px" }}
                            >
                                Select Seats
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ShowtimesPage;