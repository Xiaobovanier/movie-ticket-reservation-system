import { useEffect, useState } from "react";
import api from "../api/axios";

async function fetchShowtimesData() {
    const response = await api.get("/showtimes");
    return response.data;
}

async function createShowtime(showtimeData) {
    const response = await api.post("/showtimes", showtimeData);
    return response.data;
}

async function updateShowtime(showtimeId, showtimeData) {
    const response = await api.put(`/showtimes/${showtimeId}`, showtimeData);
    return response.data;
}

async function deleteShowtime(showtimeId) {
    await api.delete(`/showtimes/${showtimeId}`);
}

const emptyForm = {
    startTime: "",
    endTime: "",
    price: "",
    status: "AVAILABLE",
    movieId: "",
    roomId: "",
};

function toInputDateTime(value) {
    if (!value) return "";
    return value.slice(0, 16);
}

function formatDateTime(value) {
    if (!value) return value;
    return value.length === 16 ? `${value}:00` : value;
}

function AdminShowtimesPage() {
    const [showtimes, setShowtimes] = useState([]);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState(emptyForm);
    const [editingShowtimeId, setEditingShowtimeId] = useState(null);

    useEffect(() => {
        async function loadShowtimes() {
            try {
                const data = await fetchShowtimesData();
                setShowtimes(data);
                setMessage("");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load showtimes";
                setMessage(errorMessage);
            }
        }

        loadShowtimes();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setMessage("");
    }

    function validateShowtimeForm() {
        if (!formData.startTime.trim()) {
            return "Start Time is required";
        }

        if (!formData.endTime.trim()) {
            return "End Time is required";
        }

        if (!formData.price) {
            return "Price is required";
        }

        if (Number(formData.price) <= 0) {
            return "Price must be greater than 0";
        }

        if (!formData.status.trim()) {
            return "Status is required";
        }

        if (!formData.movieId) {
            return "Movie ID is required";
        }

        if (Number(formData.movieId) <= 0) {
            return "Movie ID must be greater than 0";
        }

        if (!formData.roomId) {
            return "Room ID is required";
        }

        if (Number(formData.roomId) <= 0) {
            return "Room ID must be greater than 0";
        }

        return "";
    }

    function handleEdit(showtime) {
        setEditingShowtimeId(showtime.id);
        setFormData({
            startTime: toInputDateTime(showtime.startTime),
            endTime: toInputDateTime(showtime.endTime),
            price: showtime.price || "",
            status: showtime.status || "AVAILABLE",
            movieId: showtime.movie?.id || "",
            roomId: showtime.room?.id || "",
        });
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelEdit() {
        setEditingShowtimeId(null);
        setFormData(emptyForm);
        setMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationMessage = validateShowtimeForm();
        if (validationMessage) {
            setMessage(validationMessage);
            return;
        }

        const showtimePayload = {
            startTime: formatDateTime(formData.startTime),
            endTime: formatDateTime(formData.endTime),
            price: Number(formData.price),
            status: formData.status.trim(),
            movieId: Number(formData.movieId),
            roomId: Number(formData.roomId),
        };

        try {
            if (editingShowtimeId) {
                await updateShowtime(editingShowtimeId, showtimePayload);
                setMessage("Showtime updated successfully");
            } else {
                await createShowtime(showtimePayload);
                setMessage("Showtime created successfully");
            }

            const data = await fetchShowtimesData();
            setShowtimes(data);
            setFormData(emptyForm);
            setEditingShowtimeId(null);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to save showtime";
            setMessage(errorMessage);
        }
    }

    async function handleDelete(showtimeId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this showtime?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteShowtime(showtimeId);
            setMessage("Showtime deleted successfully");

            const data = await fetchShowtimesData();
            setShowtimes(data);

            if (editingShowtimeId === showtimeId) {
                setEditingShowtimeId(null);
                setFormData(emptyForm);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to delete showtime";
            setMessage(errorMessage);
        }
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Admin Showtime Management</h1>

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

            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "700px",
                    border: "1px solid #ccc",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                }}
            >
                <h2>{editingShowtimeId ? "Edit Showtime" : "Add Showtime"}</h2>

                <div style={{ marginBottom: "12px" }}>
                    <label>Start Time</label>
                    <br />
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>End Time</label>
                    <br />
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Price</label>
                    <br />
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Status</label>
                    <br />
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Movie ID</label>
                    <br />
                    <input
                        type="number"
                        name="movieId"
                        value={formData.movieId}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Room ID</label>
                    <br />
                    <input
                        type="number"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "8px 14px", marginRight: "8px" }}>
                    {editingShowtimeId ? "Update Showtime" : "Create Showtime"}
                </button>

                {editingShowtimeId && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{ padding: "8px 14px" }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            <h2>Showtime List</h2>

            {showtimes.length === 0 ? (
                <p>No showtimes found</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "1200px",
                            backgroundColor: "white",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Start Time</th>
                            <th style={thStyle}>End Time</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Movie</th>
                            <th style={thStyle}>Movie ID</th>
                            <th style={thStyle}>Room</th>
                            <th style={thStyle}>Room ID</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {showtimes.map((showtime) => (
                            <tr key={showtime.id}>
                                <td style={tdStyle}>{showtime.id}</td>
                                <td style={tdStyle}>{showtime.startTime}</td>
                                <td style={tdStyle}>{showtime.endTime}</td>
                                <td style={tdStyle}>${showtime.price}</td>
                                <td style={tdStyle}>
                    <span
                        style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            backgroundColor:
                                showtime.status === "AVAILABLE" ? "#e8f5e9" : "#f3f3f3",
                            color:
                                showtime.status === "AVAILABLE" ? "#2e7d32" : "#666",
                        }}
                    >
                      {showtime.status}
                    </span>
                                </td>
                                <td style={tdStyle}>{showtime.movie?.title || "-"}</td>
                                <td style={tdStyle}>{showtime.movie?.id || "-"}</td>
                                <td style={tdStyle}>{showtime.room?.name || "-"}</td>
                                <td style={tdStyle}>{showtime.room?.id || "-"}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleEdit(showtime)}
                                        style={{ ...buttonStyle, marginRight: "8px" }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(showtime.id)}
                                        style={buttonStyle}
                                    >
                                        Delete
                                    </button>
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

export default AdminShowtimesPage;