import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function RegisterPage() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function validateRegisterForm() {
        if (!fullName.trim()) {
            return "Full Name is required";
        }

        if (!email.trim()) {
            return "Email is required";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }

        if (!password.trim()) {
            return "Password is required";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters";
        }

        return "";
    }

    async function handleRegister(e) {
        e.preventDefault();

        const validationMessage = validateRegisterForm();
        if (validationMessage) {
            setMessage(validationMessage);
            return;
        }

        try {
            await api.post("/auth/register", {
                fullName: fullName.trim(),
                email: email.trim(),
                password,
            });

            setMessage("Register successful. Please login.");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Register failed";
            setMessage(errorMessage);
        }
    }

    return (
        <div style={{ padding: "24px" }}>
            <h1>Register</h1>

            <form onSubmit={handleRegister} style={{ maxWidth: "320px" }}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Full Name</label>
                    <br />
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "8px 16px" }}>
                    Register
                </button>
            </form>

            {message && <p style={{ marginTop: "16px" }}>{message}</p>}
        </div>
    );
}

export default RegisterPage;