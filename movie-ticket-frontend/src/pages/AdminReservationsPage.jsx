import { useEffect, useState } from "react";
import api from "../api/axios";

async function fetchAllReservationsData() {
    const response = await api.get("/reservations");
    return response.data;
}

async function cancelReservationById(reservationId) {
    await api.delete(`/reservations/${reservationId}`);
}

function AdminReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadReservations() {
            try {
                const data = await fetchAllReservationsData();
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
        const confirmed = window.confirm(
            "Are you sure you want to cancel this reservation?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await cancelReservationById(reservationId);

            const data = await fetchAllReservationsData();
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
            <h1>Admin Reservation Management</h1>

            {message && (
                <p
                    style={{
                        marginBottom: "16px",
                        padding: "10px 12px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        backgroundColor: "#f8f8f8",
                    }}
                >
                    {message}
                </p>
            )}

            {reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "1280px",
                            backgroundColor: "white",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={thStyle}>Reservation ID</th>
                            <th style={thStyle}>User Name</th>
                            <th style={thStyle}>User Email</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Reservation Time</th>
                            <th style={thStyle}>Movie</th>
                            <th style={thStyle}>Room</th>
                            <th style={thStyle}>Showtime Start</th>
                            <th style={thStyle}>Showtime End</th>
                            <th style={thStyle}>Seats</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.reservationId}>
                                <td style={tdStyle}>{reservation.reservationId}</td>
                                <td style={tdStyle}>{reservation.userFullName || "-"}</td>
                                <td style={tdStyle}>{reservation.userEmail || "-"}</td>
                                <td style={tdStyle}>
                    <span
                        style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            backgroundColor:
                                reservation.status === "BOOKED" ? "#e8f5e9" : "#f3f3f3",
                            color:
                                reservation.status === "BOOKED" ? "#2e7d32" : "#666",
                        }}
                    >
                      {reservation.status}
                    </span>
                                </td>
                                <td style={tdStyle}>{reservation.reservationTime}</td>
                                <td style={tdStyle}>{reservation.movieTitle}</td>
                                <td style={tdStyle}>{reservation.roomName}</td>
                                <td style={tdStyle}>{reservation.showtimeStart}</td>
                                <td style={tdStyle}>{reservation.showtimeEnd}</td>
                                <td style={tdStyle}>
                                    {reservation.seatLabels?.join(", ") || "-"}
                                </td>
                                <td style={tdStyle}>
                                    {reservation.status === "BOOKED" ? (
                                        <button
                                            onClick={() =>
                                                handleCancelReservation(reservation.reservationId)
                                            }
                                            style={buttonStyle}
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        <span style={{ color: "#888" }}>—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const thStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
};

const tdStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    verticalAlign: "top",
};

const buttonStyle = {
    padding: "6px 12px",
    border: "1px solid #333",
    borderRadius: "6px",
    backgroundColor: "white",
    cursor: "pointer",
};

export default AdminReservationsPage;