import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all details");
      return;
    }

    try {
      await loginUser(form.email, form.password);
      alert("Login successful");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="card rounded-3xl shadow p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full input"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full input"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
            Login
          </button>
        </form>

        <p className="text-center muted mt-6">
          New customer?{" "}
          <Link to="/register" className="text-orange-600 font-bold">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;