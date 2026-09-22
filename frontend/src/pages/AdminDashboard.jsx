import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-charcoal/10 rounded-2xl p-5">
      <p className="text-charcoal/45 text-sm mb-2">{label}</p>
      <p className={`font-display text-3xl font-semibold ${accent || "text-charcoal"}`}>{value}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return <h2 className="text-charcoal/40 text-xs font-semibold tracking-wide uppercase mb-3">{children}</h2>;
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

  if (error) return <div className="max-w-7xl mx-auto px-6 py-16 text-clay">{error}</div>;
  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-sand rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-semibold mb-1">Dashboard</h1>
        <p className="text-charcoal/50 mb-10">A quick look at how the fleet is doing.</p>

        <SectionLabel>Customers</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total customers" value={stats.total_customers} />
        </div>

        <SectionLabel>Vehicles</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total vehicles" value={stats.total_vehicles} />
          <StatCard label="Available" value={stats.available_vehicles} accent="text-sage-dark" />
          <StatCard label="Rented" value={stats.rented_vehicles} accent="text-sunset-dark" />
          <StatCard label="Maintenance" value={stats.maintenance_vehicles} accent="text-clay" />
        </div>

        <SectionLabel>Bookings</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total bookings" value={stats.total_bookings} />
          <StatCard label="Pending" value={stats.pending_bookings} accent="text-yellow-600" />
          <StatCard label="Active" value={stats.active_bookings} accent="text-sage-dark" />
          <StatCard label="Completed" value={stats.completed_bookings} />
        </div>

        <SectionLabel>Revenue</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 bg-charcoal text-cream rounded-2xl p-6">
            <p className="text-cream/50 text-sm mb-2">Total revenue</p>
            <p className="font-display text-4xl font-semibold text-sunset">Rs. {stats.total_revenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
