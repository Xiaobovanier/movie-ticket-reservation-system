import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const isAdmin = email === "admin@test.com";

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/movies" replace />;
    }

    return children;
}

export default AdminRoute;