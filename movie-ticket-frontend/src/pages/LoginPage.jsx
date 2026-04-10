import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setMessage("");
    }

    function validateForm() {
        if (!formData.email.trim()) {
            return "Email is required";
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return "Please enter a valid email address";
        }

        if (!formData.password.trim()) {
            return "Password is required";
        }

        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationMessage = validateForm();
        if (validationMessage) {
            setMessage(validationMessage);
            return;
        }

        try {
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.user.email);

            if (response.data.user.fullName) {
                localStorage.setItem("fullName", response.data.user.fullName);
            } else {
                localStorage.removeItem("fullName");
            }

            setMessage("");
            navigate("/movies");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Login failed";
            setMessage(errorMessage);
        }
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: "420px" }}>
                <div style={{ marginBottom: "16px" }}>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "10px 18px" }}>
                    Login
                </button>
            </form>

            {message && (
                <p style={{ marginTop: "16px" }}>
                    {message}
                </p>
            )}

            <p style={{ marginTop: "16px" }}>
                No account yet? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;