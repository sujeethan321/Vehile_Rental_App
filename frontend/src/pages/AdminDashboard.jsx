import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

function StatCard({ label, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load dashboard stats"));
  }, []);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <h2 className="text-lg font-semibold text-gray-600 mb-3">Customers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Customers" value={stats.total_customers} />
      </div>

      <h2 className="text-lg font-semibold text-gray-600 mb-3">Vehicles</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Vehicles" value={stats.total_vehicles} />
        <StatCard label="Available" value={stats.available_vehicles} color="text-green-600" />
        <StatCard label="Rented" value={stats.rented_vehicles} color="text-blue-600" />
        <StatCard label="Maintenance" value={stats.maintenance_vehicles} color="text-yellow-600" />
      </div>

      <h2 className="text-lg font-semibold text-gray-600 mb-3">Bookings</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={stats.total_bookings} />
        <StatCard label="Pending" value={stats.pending_bookings} color="text-yellow-600" />
        <StatCard label="Active" value={stats.active_bookings} color="text-green-600" />
        <StatCard label="Completed" value={stats.completed_bookings} color="text-gray-600" />
      </div>

      <h2 className="text-lg font-semibold text-gray-600 mb-3">Revenue</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`Rs. ${stats.total_revenue}`} color="text-blue-700" />
      </div>
    </div>
  );
}

export default AdminDashboard;