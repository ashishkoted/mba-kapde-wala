import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleLogin = (e) => {
        e.preventDefault();

        if (
            form.email === "admin@mba.com" &&
            form.password === "admin123"
        ) {
            localStorage.setItem("isAdmin", "true");
            navigate("/admin/dashboard");
        } else {
            alert("Invalid admin login");
        }
    };

    return (
        <main className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center">Admin Login</h1>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">
                    <input
                        type="email"
                        placeholder="Admin Email"
                        className="w-full border rounded-xl px-4 py-3"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Admin Password"
                        className="w-full border rounded-xl px-4 py-3"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Email: admin@mba.com | Password: admin123
                </p>
            </div>
        </main>
    );
}

export default AdminLogin;