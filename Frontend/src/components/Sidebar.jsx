import React from "react";
import {
  Users,
  LayoutDashboard,
  CalendarDays,
  Menu,
  X,
  Stethoscope,
  Receipt,
  Package,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Appointments", icon: CalendarDays, path: "/appointments" },
    { name: "Stock", icon: Package, path: "/Stock" },
    { name: "Doctors", icon: Stethoscope, path: "/Doctors" },
    { name: "Staff", icon: Users, path: "/StaffShifts" },
    { name: "Billing", icon: Receipt, path: "/Billing" },
  ];

  // Helper function to check if a path is active (case-insensitive)
  const isActive = (path) => {
    const currentPath = location.pathname.toLowerCase();
    const targetPath = path.toLowerCase();
    
    // Handle root path
    if (targetPath === "/") {
      return currentPath === "/" || currentPath === "";
    }
    
    // Check exact match or starts with (for nested routes)
    return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300
        ${isCollapsed ? "w-16" : "w-56"}
        bg-gradient-to-b from-blue-900 to-blue-800 text-white
        flex flex-col justify-between shadow-2xl`}
    >
      {/* Header */}
      <div>
        <div className={`${isCollapsed ? "p-3" : "p-4"} border-b border-blue-700`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">MediClinic</h1>
                  <p className="text-[10px] text-blue-300">Healthcare</p>
                </div>
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-2">
                <Home className="w-4 h-4 text-white" />
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Menu className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 mt-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${isCollapsed ? "justify-center" : ""} gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
              >
                <div className={`p-1.5 rounded ${active ? "bg-white/20" : "bg-white/10"}`}>
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-blue-300"}`} />
                </div>
                
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1.5 bg-blue-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-blue-700 shadow-md">
                    {item.name}
                    <div className="absolute top-1/2 -left-1 w-1.5 h-1.5 bg-blue-800 transform -translate-y-1/2 rotate-45"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer - Only copyright when expanded */}
      {!isCollapsed && (
        <div className="p-3 border-t border-blue-700 text-center">
          <p className="text-[10px] text-blue-400 mb-1">© 2025 MediClinic</p>
          <p className="text-[9px] text-blue-500">v2.1.0</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;