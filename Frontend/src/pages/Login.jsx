import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Inline error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // ----------------- Patient Login -----------------
      const patientResponse = await axios.post(
        "http://127.0.0.1:8000/api/login/patient/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh, name } = patientResponse.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_name", name);

      setUser({ name, role: "patient" });
      navigate("/patient-dashboard");
    } catch (patientError) {
      try {
        // ----------------- Staff Login -----------------
        const staffResponse = await axios.post(
          "http://127.0.0.1:8000/api/login/staff/",
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        // Expect backend to send first_name, last_name, role, access, refresh
        const { access, refresh, first_name, last_name, role } = staffResponse.data;

        // Save tokens and user info for Header
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_first_name", first_name);
        localStorage.setItem("user_last_name", last_name);
        localStorage.setItem("user_role", role);

        setUser({ firstName: first_name, lastName: last_name, role });

        // Redirect based on role
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "doctor") navigate("/doctor-dashboard");
        else if (role === "nurse") navigate("/nurse-dashboard");
        else navigate("/"); // fallback
      } catch (staffError) {
        console.error(staffError.response?.data || staffError.message);
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Inline error message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-between items-center text-sm mb-4">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
