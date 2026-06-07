import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
        return <Navigate to="/admin/login" />;
    }

    return children;
}

export default AdminRoute;