import React from "react";
import { Users, LayoutDashboard, CalendarDays, Menu, X, User,Stethoscope ,Receipt} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={24} />, path: "/" },
    { name: "Patients", icon: <Users size={24} />, path: "/patients" },
    { name: "Appointments", icon: <CalendarDays size={24} />, path: "/appointments" },
    // New menu items
    { name: "Doctor", icon: <Stethoscope size={24} />, path: "/Doctors" }, // placeholder
    { name: "Staff", icon: <User size={24} />, path: "/StaffShifts" }, // placeholder
    { name: "Billing", icon: <Receipt size={24} />, path: "/Billing" }, // placeholder

  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 z-50`}
    >
      {/* Top Section with toggle */}
      <div>
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } p-4`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-gray-100 ${
              isCollapsed ? "flex items-center justify-center" : ""
            }`}
          >
            {isCollapsed ? <Menu size={28} /> : <X size={22} />}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-1 mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600 shadow-sm font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center justify-center min-w-[24px]">
                  {React.cloneElement(item.icon, {
                    size: isCollapsed ? 28 : 22,
                  })}
                </div>
                {!isCollapsed && (
                  <span className="text-sm tracking-wide">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom copyright */}
      <div className="p-4 text-center text-xs text-gray-400">
        {!isCollapsed && "© 2025 MediClinic"}
      </div>
    </div>
  );
};

export default Sidebar;
