import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Register() {
  const { register } = useContext(UserContext); // ✅ use register, not login
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (name && email && password) {
      const userData = { name, email, password };
      const success = register(userData); // ✅ call the register function

      if (success) {
        alert("Account created successfully!");
        navigate("/patient");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Create a New Account
        </h2>

        <form onSubmit={handleRegister}>
          <label className="block mb-2 text-sm font-semibold">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block mb-2 text-sm font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
