import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("registeredUsers");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  // ✅ Register new patient
  const register = (newUser) => {
    const exists = users.some((u) => u.email === newUser.email);
    if (exists) {
      alert("An account with this email already exists.");
      return false;
    }

    const updatedUsers = [...users, { ...newUser, bookings: [], role: "patient" }];
    setUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return true;
  };

  // ✅ Login — Detect admin or patient
  const login = ({ email, password }) => {
    if (email.endsWith("@clinic.com")) {
      const adminUser = { name: "Admin", email, role: "admin" };
      setUser(adminUser);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      return "admin";
    }

    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (existingUser) {
      const patientUser = { ...existingUser, role: "patient" };
      setUser(patientUser);
      localStorage.setItem("currentUser", JSON.stringify(patientUser));
      return "patient";
    }

    alert("Account not found. Please register first.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const addBooking = (booking) => {
    if (!user) return alert("Please log in first.");

    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        const updatedBookings = [...(u.bookings || []), booking];
        const updatedUser = { ...u, bookings: updatedBookings };

        if (user.email === u.email) {
          setUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }
        return updatedUser;
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  const getUserBookings = () => {
    if (!user) return [];
    const current = users.find((u) => u.email === user.email);
    return current?.bookings || [];
  };

  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  }, [users]);

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        register,
        login,
        logout,
        addBooking,
        getUserBookings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
