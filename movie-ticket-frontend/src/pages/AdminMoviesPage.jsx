import { useEffect, useState } from "react";
import api from "../api/axios";

async function fetchMoviesData() {
    const response = await api.get("/movies");
    return response.data;
}

async function createMovie(movieData) {
    const response = await api.post("/movies", movieData);
    return response.data;
}

async function updateMovie(movieId, movieData) {
    const response = await api.put(`/movies/${movieId}`, movieData);
    return response.data;
}

async function deleteMovie(movieId) {
    await api.delete(`/movies/${movieId}`);
}

const emptyForm = {
    title: "",
    description: "",
    durationMinutes: "",
    rating: "",
    posterUrl: "",
    active: true,
};

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function AdminMoviesPage() {
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState(emptyForm);
    const [editingMovieId, setEditingMovieId] = useState(null);

    useEffect(() => {
        async function loadMovies() {
            try {
                const data = await fetchMoviesData();
                setMovies(data);
                setMessage("");
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load movies";
                setMessage(errorMessage);
            }
        }

        loadMovies();
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

        setMessage("");
    }

    function validateMovieForm() {
        if (!formData.title.trim()) {
            return "Title is required";
        }

        if (!formData.description.trim()) {
            return "Description is required";
        }

        if (!formData.durationMinutes) {
            return "Duration Minutes is required";
        }

        if (Number(formData.durationMinutes) <= 0) {
            return "Duration Minutes must be greater than 0";
        }

        if (!formData.rating.trim()) {
            return "Rating is required";
        }

        if (formData.posterUrl.trim() && !isValidUrl(formData.posterUrl.trim())) {
            return "Poster URL must be a valid URL";
        }

        return "";
    }

    function handleEdit(movie) {
        setEditingMovieId(movie.id);
        setFormData({
            title: movie.title || "",
            description: movie.description || "",
            durationMinutes: movie.durationMinutes || "",
            rating: movie.rating || "",
            posterUrl: movie.posterUrl || "",
            active: movie.active ?? true,
        });
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelEdit() {
        setEditingMovieId(null);
        setFormData(emptyForm);
        setMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationMessage = validateMovieForm();
        if (validationMessage) {
            setMessage(validationMessage);
            return;
        }

        const moviePayload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            durationMinutes: Number(formData.durationMinutes),
            rating: formData.rating.trim(),
            posterUrl: formData.posterUrl.trim(),
            active: formData.active,
        };

        try {
            if (editingMovieId) {
                await updateMovie(editingMovieId, moviePayload);
                setMessage("Movie updated successfully");
            } else {
                await createMovie(moviePayload);
                setMessage("Movie created successfully");
            }

            const data = await fetchMoviesData();
            setMovies(data);
            setFormData(emptyForm);
            setEditingMovieId(null);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to save movie";
            setMessage(errorMessage);
        }
    }

    async function handleDelete(movieId) {
        const confirmed = window.confirm("Are you sure you want to delete this movie?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteMovie(movieId);
            setMessage("Movie deleted successfully");

            const data = await fetchMoviesData();
            setMovies(data);

            if (editingMovieId === movieId) {
                setEditingMovieId(null);
                setFormData(emptyForm);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to delete movie";
            setMessage(errorMessage);
        }
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Admin Movie Management</h1>

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
                    maxWidth: "650px",
                    border: "1px solid #ccc",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                }}
            >
                <h2>{editingMovieId ? "Edit Movie" : "Add Movie"}</h2>

                <div style={{ marginBottom: "12px" }}>
                    <label>Title</label>
                    <br />
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Description</label>
                    <br />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", minHeight: "80px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Duration Minutes</label>
                    <br />
                    <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Rating</label>
                    <br />
                    <input
                        type="text"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Poster URL</label>
                    <br />
                    <input
                        type="text"
                        name="posterUrl"
                        value={formData.posterUrl}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                        />{" "}
                        Active
                    </label>
                </div>

                <button type="submit" style={{ padding: "8px 14px", marginRight: "8px" }}>
                    {editingMovieId ? "Update Movie" : "Create Movie"}
                </button>

                {editingMovieId && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{ padding: "8px 14px" }}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            <h2>Movie List</h2>

            {movies.length === 0 ? (
                <p>No movies found</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "1100px",
                            backgroundColor: "white",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Description</th>
                            <th style={thStyle}>Duration</th>
                            <th style={thStyle}>Rating</th>
                            <th style={thStyle}>Poster URL</th>
                            <th style={thStyle}>Active</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td style={tdStyle}>{movie.id}</td>
                                <td style={tdStyle}>{movie.title}</td>
                                <td style={tdStyle}>{movie.description}</td>
                                <td style={tdStyle}>{movie.durationMinutes} min</td>
                                <td style={tdStyle}>{movie.rating}</td>
                                <td style={tdStyle}>
                                    {movie.posterUrl ? (
                                        <a
                                            href={movie.posterUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {movie.posterUrl}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td style={tdStyle}>
                    <span
                        style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            backgroundColor: movie.active ? "#e8f5e9" : "#f3f3f3",
                            color: movie.active ? "#2e7d32" : "#666",
                        }}
                    >
                      {movie.active ? "YES" : "NO"}
                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleEdit(movie)}
                                        style={{ ...buttonStyle, marginRight: "8px" }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(movie.id)}
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

export default AdminMoviesPage;