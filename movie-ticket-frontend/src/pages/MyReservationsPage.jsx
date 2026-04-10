import { useEffect, useState } from "react";
import api from "../api/axios";

async function fetchMyReservationsData() {
    const response = await api.get("/reservations/my");
    return response.data;
}

async function cancelReservationById(reservationId) {
    await api.delete(`/reservations/${reservationId}`);
}

function MyReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadReservations() {
            try {
                const data = await fetchMyReservationsData();
                setReservations(data);
                setMessage("");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load reservations";
                setMessage(errorMessage);
            }
        }

        loadReservations();
    }, []);

    async function handleCancelReservation(reservationId) {
        try {
            await cancelReservationById(reservationId);

            const data = await fetchMyReservationsData();
            setReservations(data);
            setMessage("Reservation cancelled successfully");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to cancel reservation";
            setMessage(errorMessage);
        }
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>My Reservations</h1>

            {message && <p>{message}</p>}

            {reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : (
                <div>
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.reservationId}
                            style={{
                                border: "1px solid #ccc",
                                padding: "16px",
                                marginBottom: "12px",
                                borderRadius: "8px",
                            }}
                        >
                            <p>
                                <strong>Reservation ID:</strong> {reservation.reservationId}
                            </p>
                            <p>
                                <strong>Status:</strong> {reservation.status}
                            </p>
                            <p>
                                <strong>Reservation Time:</strong> {reservation.reservationTime}
                            </p>
                            <p>
                                <strong>Movie:</strong> {reservation.movieTitle}
                            </p>
                            <p>
                                <strong>Room:</strong> {reservation.roomName}
                            </p>
                            <p>
                                <strong>Showtime Start:</strong> {reservation.showtimeStart}
                            </p>
                            <p>
                                <strong>Showtime End:</strong> {reservation.showtimeEnd}
                            </p>
                            <p>
                                <strong>Seats:</strong> {reservation.seatLabels?.join(", ")}
                            </p>

                            {reservation.status === "BOOKED" && (
                                <button
                                    onClick={() =>
                                        handleCancelReservation(reservation.reservationId)
                                    }
                                    style={{
                                        marginTop: "10px",
                                        padding: "8px 12px",
                                    }}
                                >
                                    Cancel Reservation
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyReservationsPage;