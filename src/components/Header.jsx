import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ isCollapsed, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowMenu(false);         // Close dropdown
    if (onLogout) onLogout();   // Reset admin login state in App
    navigate("/admin");         // Redirect to admin login
  };

  return (
    <header
      className={`fixed top-0 h-20 bg-white flex items-center justify-between px-8 shadow-sm z-50 transition-all duration-300 ${
        isCollapsed
          ? "left-20 w-[calc(100%-5rem)]"
          : "left-64 w-[calc(100%-16rem)]"
      }`}
    >
      {/* Left Section — Clinic Name + Search */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Smile Care Center Dashboard
        </h1>

        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 shadow-sm focus-within:border-blue-400">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent outline-none flex-1 text-sm text-gray-700"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {/* Profile + Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src="/user.png"
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="text-sm text-left">
              <p className="font-medium text-gray-800">Asst. Hassan Sami</p>
              <p className="text-gray-500 text-xs">Desk Assistant</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
