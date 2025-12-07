import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Store logged-in user info
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // ---------------- Registration ----------------
  const registerUser = async (userData, type = "patient") => {
    try {
      setLoading(true);
      const url =
        type === "patient"
          ? "http://127.0.0.1:8000/api/register/patient/"
          : "http://127.0.0.1:8000/api/register/staff/";

      const response = await axios.post(url, userData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message);
      setLoading(false);
      return true;
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed");
      setLoading(false);
      return false;
    }
  };

  // ---------------- Login ----------------
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      // Try patient login first
      const patientResponse = await axios.post(
        "http://127.0.0.1:8000/api/login/patient/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh, name } = patientResponse.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("currentUser", JSON.stringify({ name, email, role: "patient" }));
      setUser({ name, email, role: "patient" });

      setLoading(false);
      return "patient";
    } catch (patientError) {
      try {
        // Try staff login
        const staffResponse = await axios.post(
          "http://127.0.0.1:8000/api/login/staff/",
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        const { access, refresh, username, role } = staffResponse.data;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name: username, email, role })
        );
        setUser({ name: username, email, role });

        setLoading(false);
        return role;
      } catch (staffError) {
        console.error(staffError.response?.data || staffError.message);
        alert("Invalid email or password. Please try again.");
        setLoading(false);
        return false;
      }
    }
  };

  // ---------------- Logout ----------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // ---------------- Utility: get access token ----------------
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        logout,
        getAccessToken,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
