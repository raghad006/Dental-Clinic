import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, LogOut, User, Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ isCollapsed, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const firstName = localStorage.getItem("user_first_name") || "User";
    const lastName = localStorage.getItem("user_last_name") || "";
    const role = (localStorage.getItem("user_role") || "").toLowerCase();

    let prefix = "";
    let roleDisplay = "";

    switch (role) {
      case "doctor":
        prefix = "Dr.";
        roleDisplay = "Doctor";
        break;
      case "nurse":
        prefix = "Nrs.";
        roleDisplay = "Nurse";
        break;
      case "admin":
        prefix = "Admin";
        roleDisplay = "Administrator";
        break;
      default:
        roleDisplay = role;
    }

    setDisplayName(`${prefix} ${firstName} ${lastName}`.trim());
    setUserRole(roleDisplay);
  }, []);

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
    setShowMenu(false);
    if (onLogout) onLogout();
    localStorage.clear();
    navigate("/login");
  };

  const handleSettings = () => {
    setShowMenu(false);
    navigate("/settings");
  };

  const handleHelp = () => {
    setShowMenu(false);
    // Navigate to help page or open help modal
    console.log("Help clicked");
  };

  return (
    <header
      className={`fixed top-0 h-20 z-40 transition-all duration-300
        ${
          isCollapsed
            ? "left-16 w-[calc(100%-4rem)]"
            : "left-56 w-[calc(100%-14rem)]"
        }
        bg-gradient-to-r from-blue-800 to-blue-900 text-white
        flex items-center justify-between px-8 border-b border-blue-700`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Welcome Message */}
        <div>
          <h1 className="text-xl font-bold text-white">Welcome back!</h1>
          <p className="text-sm text-blue-200">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 w-96 border border-blue-600">
          <Search className="w-5 h-5 text-blue-300 mr-3" />
          <input
            type="text"
            placeholder="Search patients, appointments, doctors..."
            className="bg-transparent outline-none flex-1 text-sm text-white placeholder-blue-300"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-lg hover:bg-white/10 transition-colors group">
          <Bell className="w-5 h-5 text-blue-200" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></span>
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-blue-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-blue-700">
            Notifications
            <div className="absolute bottom-full right-3 -mb-1 w-2 h-2 bg-blue-800 transform rotate-45 border-r border-b border-blue-700"></div>
          </div>
        </button>

        {/* Help */}
        <button 
          onClick={handleHelp}
          className="p-2.5 rounded-lg hover:bg-white/10 transition-colors group relative"
        >
          <HelpCircle className="w-5 h-5 text-blue-200" />
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-blue-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-blue-700">
            Help & Support
            <div className="absolute bottom-full right-3 -mb-1 w-2 h-2 bg-blue-800 transform rotate-45 border-r border-b border-blue-700"></div>
          </div>
        </button>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{displayName}</p>
              <p className="text-xs text-blue-300">{userRole}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${showMenu ? 'bg-green-500' : 'bg-blue-400'}`}></div>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-gradient-to-b from-blue-800 to-blue-900 rounded-xl shadow-2xl border border-blue-700 overflow-hidden z-50">
              {/* User Info */}
              <div className="p-4 border-b border-blue-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{displayName}</p>
                    <p className="text-xs text-blue-300">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-200 hover:bg-blue-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleHelp}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-200 hover:bg-blue-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-blue-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;