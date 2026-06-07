import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all details");
      return;
    }

    try {
      await registerUser(form.email, form.password);
      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="card rounded-3xl shadow p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full input"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

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
            Register
          </button>
        </form>

        <p className="text-center muted mt-6">
          Already have account?{" "}
          <Link to="/login" className="text-orange-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;