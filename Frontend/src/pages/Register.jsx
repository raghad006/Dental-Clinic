import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register({ isStaff = false }) {
  const navigate = useNavigate();

  // ---- State for staff ----
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("nurse");
  const [registrationCode, setRegistrationCode] = useState("");

  // ---- State for patient ----
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  // ---- Common fields ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      let url = "";
      let payload = {};

      if (isStaff) {
        // Staff registration
        url = "http://127.0.0.1:8000/api/register/staff/";
        payload = { username, email, password, role, registration_code: registrationCode };
      } else {
        // Patient registration
        url = "http://127.0.0.1:8000/api/register/patient/";
        payload = { name, email, password, phone, date_of_birth: dateOfBirth, address };
      }

      const response = await axios.post(url, payload);

      // Backend may return the created object
      alert(isStaff ? "Staff registered successfully!" : "Patient registered successfully!");

      // Redirect after successful registration
      navigate(isStaff ? "/login" : "/login");
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        // Convert backend error object into readable message
        const data = error.response.data;
        let msg = "";

        if (typeof data === "string") {
          msg = data;
        } else if (typeof data === "object") {
          msg = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        }

        alert(msg);
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          {isStaff ? "Staff Registration" : "Patient Registration"}
        </h2>

        <form onSubmit={handleRegister}>
          {isStaff ? (
            <>
              <label className="block mb-2 text-sm font-semibold">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label className="block mb-2 text-sm font-semibold">Role</label>
              <select
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>

              <label className="block mb-2 text-sm font-semibold">Registration Code</label>
              <input
                type="text"
                placeholder="Enter your registration code"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <label className="block mb-2 text-sm font-semibold">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="block mb-2 text-sm font-semibold">Phone</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label className="block mb-2 text-sm font-semibold">Date of Birth</label>
              <input
                type="date"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />

              <label className="block mb-2 text-sm font-semibold">Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </>
          )}

          <label className="block mb-2 text-sm font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
