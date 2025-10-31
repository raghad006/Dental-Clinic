import React from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Clinic Admin</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/doctors" className="p-4 bg-white rounded shadow">Doctor Management</Link>
        <Link to="/billing" className="p-4 bg-white rounded shadow">Billing Management</Link>
        <Link to="/patients" className="p-4 bg-white rounded shadow">Patient Management</Link>
      </div>
      <div className="mt-6 p-4 bg-white rounded shadow">
        <div className="font-medium">Overview</div>
        <div className="text-sm text-gray-600">
          Placeholder analytics and KPIs will appear here.
        </div>
      </div>
    </div>
  );
}
