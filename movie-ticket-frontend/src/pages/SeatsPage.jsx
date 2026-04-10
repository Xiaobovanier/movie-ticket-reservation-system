import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function SeatsPage() {
    const { showtimeId } = useParams();

    const [showtime, setShowtime] = useState(null);
    const [seats, setSeats] = useState([]);
    const [bookedSeatIds, setBookedSeatIds] = useState([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadPageData() {
            try {
                const showtimeResponse = await api.get(`/showtimes/${showtimeId}`);
                setShowtime(showtimeResponse.data);

                const roomId = showtimeResponse.data.room.id;
                const seatsResponse = await api.get(`/seats/room/${roomId}`);
                setSeats(seatsResponse.data);

                const bookedSeatsResponse = await api.get(
                    `/reservations/showtime/${showtimeId}/booked-seats`
                );
                setBookedSeatIds(bookedSeatsResponse.data);

                setMessage("");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load seats";
                setMessage(errorMessage);
            }
        }

        loadPageData();
    }, [showtimeId]);

    const groupedSeats = useMemo(() => {
        const groups = {};

        seats.forEach((seat) => {
            const row = seat.rowLabel;
            if (!groups[row]) {
                groups[row] = [];
            }
            groups[row].push(seat);
        });

        Object.keys(groups).forEach((row) => {
            groups[row].sort((a, b) => a.seatNumber - b.seatNumber);
        });

        return groups;
    }, [seats]);

    function handleSeatClick(seatId) {
        if (bookedSeatIds.includes(seatId)) {
            return;
        }

        if (selectedSeatIds.includes(seatId)) {
            setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
        } else {
            setSelectedSeatIds([...selectedSeatIds, seatId]);
        }

        setMessage("");
    }

    async function handleConfirmReservation() {
        if (selectedSeatIds.length === 0) {
            setMessage("Please select at least one seat");
            return;
        }

        try {
            const response = await api.post("/reservations", {
                showtimeId: Number(showtimeId),
                seatIds: selectedSeatIds,
            });

            setMessage(`Reservation successful: ${response.data.reservationId}`);
            setSelectedSeatIds([]);

            const bookedSeatsResponse = await api.get(
                `/reservations/showtime/${showtimeId}/booked-seats`
            );
            setBookedSeatIds(bookedSeatsResponse.data);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to create reservation";
            setMessage(errorMessage);
        }
    }

    function getSeatButtonStyle(seatId) {
        const isBooked = bookedSeatIds.includes(seatId);
        const isSelected = selectedSeatIds.includes(seatId);

        return {
            width: "58px",
            height: "48px",
            borderRadius: "12px 12px 8px 8px",
            border: "1px solid #777",
            cursor: isBooked ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            background: isBooked
                ? "#cfcfcf"
                : isSelected
                    ? "linear-gradient(180deg, #58c96a 0%, #3fa852 100%)"
                    : "#ffffff",
            color: isBooked ? "#7b7b7b" : isSelected ? "#ffffff" : "#111111",
            boxShadow: isBooked
                ? "none"
                : isSelected
                    ? "0 4px 10px rgba(63,168,82,0.25)"
                    : "0 2px 6px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
        };
    }

    function renderSeatRow(rowLabel, rowSeats) {
        const midpoint = Math.ceil(rowSeats.length / 2);
        const leftSeats = rowSeats.slice(0, midpoint);
        const rightSeats = rowSeats.slice(midpoint);

        return (
            <div
                key={rowLabel}
                style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    alignItems: "center",
                    marginBottom: "18px",
                    columnGap: "18px",
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        textAlign: "left",
                    }}
                >
                    Row {rowLabel}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        {leftSeats.map((seat) => {
                            const label = `${seat.rowLabel}${seat.seatNumber}`;
                            const isBooked = bookedSeatIds.includes(seat.id);

                            return (
                                <button
                                    key={seat.id}
                                    onClick={() => handleSeatClick(seat.id)}
                                    disabled={isBooked}
                                    style={getSeatButtonStyle(seat.id)}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div
                        style={{
                            width: "42px",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        {rightSeats.map((seat) => {
                            const label = `${seat.rowLabel}${seat.seatNumber}`;
                            const isBooked = bookedSeatIds.includes(seat.id);

                            return (
                                <button
                                    key={seat.id}
                                    onClick={() => handleSeatClick(seat.id)}
                                    disabled={isBooked}
                                    style={getSeatButtonStyle(seat.id)}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (!showtime) {
        return <div style={{ padding: "24px" }}>Loading...</div>;
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Select Seats</h1>

            {message && (
                <div
                    style={{
                        marginBottom: "16px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #d8d8d8",
                        backgroundColor: "#ffffff",
                        maxWidth: "1180px",
                    }}
                >
                    {message}
                </div>
            )}

            <div
                style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "16px",
                    padding: "22px",
                    marginBottom: "24px",
                    backgroundColor: "#ffffff",
                    maxWidth: "1180px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                }}
            >
                <p>
                    <strong>Movie:</strong> {showtime.movie.title}
                </p>
                <p>
                    <strong>Room:</strong> {showtime.room.name}
                </p>
                <p>
                    <strong>Start:</strong> {showtime.startTime}
                </p>
                <p>
                    <strong>Price:</strong> ${showtime.price}
                </p>
            </div>

            <div
                style={{
                    maxWidth: "1180px",
                    marginBottom: "26px",
                }}
            >
                <div
                    style={{
                        height: "18px",
                        width: "92%",
                        margin: "0 auto 8px",
                        background:
                            "linear-gradient(180deg, #5c5c5c 0%, #2f2f2f 45%, #171717 100%)",
                        borderRadius: "999px 999px 14px 14px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
                    }}
                />
                <div
                    style={{
                        textAlign: "center",
                        color: "#444",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                        fontSize: "15px",
                    }}
                >
                    SCREEN
                </div>
            </div>

            <div
                style={{
                    maxWidth: "1180px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "18px",
                    padding: "28px 22px 18px",
                    background:
                        "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#777",
                        marginBottom: "22px",
                        letterSpacing: "1px",
                    }}
                >
                    Please select your seats
                </div>

                {Object.keys(groupedSeats)
                    .sort()
                    .map((rowLabel, index) => (
                        <div
                            key={rowLabel}
                            style={{
                                transform: `scale(${1 - index * 0.015})`,
                                transformOrigin: "top center",
                            }}
                        >
                            {renderSeatRow(rowLabel, groupedSeats[rowLabel])}
                        </div>
                    ))}

                <div
                    style={{
                        marginTop: "10px",
                        textAlign: "center",
                        color: "#999",
                        fontSize: "13px",
                        letterSpacing: "1px",
                    }}
                >
                    Back seats
                </div>
            </div>

            <div
                style={{
                    maxWidth: "1180px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "16px",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    marginBottom: "20px",
                }}
            >
                <p style={{ fontWeight: "bold", marginBottom: "12px" }}>Legend:</p>
                <div
                    style={{
                        display: "flex",
                        gap: "22px",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                    width: "24px",
                    height: "24px",
                    display: "inline-block",
                    border: "1px solid #777",
                    borderRadius: "8px 8px 6px 6px",
                    backgroundColor: "#ffffff",
                }}
            />
                        <span>Available</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                    width: "24px",
                    height: "24px",
                    display: "inline-block",
                    border: "1px solid #4caf50",
                    borderRadius: "8px 8px 6px 6px",
                    background:
                        "linear-gradient(180deg, #58c96a 0%, #3fa852 100%)",
                }}
            />
                        <span>Selected</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                    width: "24px",
                    height: "24px",
                    display: "inline-block",
                    border: "1px solid #888",
                    borderRadius: "8px 8px 6px 6px",
                    backgroundColor: "#cfcfcf",
                }}
            />
                        <span>Booked</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleConfirmReservation}
                style={{
                    padding: "14px 24px",
                    border: "1px solid #666",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
            >
                Confirm Reservation
            </button>
        </div>
    );
}

export default SeatsPage;