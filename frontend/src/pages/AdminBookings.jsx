import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-sage/20 text-sage-dark",
  completed: "bg-charcoal/10 text-charcoal/50",
  cancelled: "bg-clay/10 text-clay",
};

const NEXT_STATUS_OPTIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = () => {
    axiosClient.get("/bookings/").then((res) => setBookings(res.data.sort((a, b) => b.id - a.id)));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setError("");
    setUpdatingId(bookingId);
    try {
      await axiosClient.put(`/bookings/${bookingId}/status`, { booking_status: newStatus });
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = filterStatus
    ? bookings.filter((b) => b.booking_status === filterStatus)
    : bookings;

  const statusOptions = ["pending", "confirmed", "active", "completed", "cancelled"];

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-semibold mb-1">Bookings</h1>
        <p className="text-charcoal/50 mb-8">{bookings.length} total across all customers.</p>

        {error && <p className="text-clay mb-4">{error}</p>}

        <div className="flex gap-2 mb-6 overflow-x-auto chip-scroll">
          <button
            onClick={() => setFilterStatus("")}
            className={`shrink-0 text-sm px-4 py-2 rounded-full border transition-colors ${
              filterStatus === "" ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/15 text-charcoal/60 hover:border-charcoal/30"
            }`}
          >
            All
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`shrink-0 text-sm px-4 py-2 rounded-full border capitalize transition-colors ${
                filterStatus === s ? "bg-charcoal text-cream border-charcoal" : "border-charcoal/15 text-charcoal/60 hover:border-charcoal/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white border border-charcoal/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal/40 text-xs uppercase tracking-wide border-b border-charcoal/8">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Dates</th>
                <th className="p-4 font-medium">Days</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/60">
                  <td className="p-4 font-medium">#{b.id}</td>
                  <td className="p-4 text-charcoal/60">#{b.customer_id}</td>
                  <td className="p-4 text-charcoal/60">#{b.vehicle_id}</td>
                  <td className="p-4 text-charcoal/60 whitespace-nowrap">{b.start_date} &rarr; {b.end_date}</td>
                  <td className="p-4 text-charcoal/60">{b.rental_days}</td>
                  <td className="p-4 font-medium">Rs. {b.total_amount}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[b.booking_status]}`}>
                      {b.booking_status}
                    </span>
                  </td>
                  <td className="p-4 space-x-3 whitespace-nowrap">
                    {NEXT_STATUS_OPTIONS[b.booking_status].length === 0 && (
                      <span className="text-charcoal/30 text-xs">No actions</span>
                    )}
                    {NEXT_STATUS_OPTIONS[b.booking_status].map((nextStatus) => (
                      <button
                        key={nextStatus}
                        disabled={updatingId === b.id}
                        onClick={() => handleStatusChange(b.id, nextStatus)}
                        className="text-sunset-dark font-medium hover:underline capitalize disabled:opacity-50"
                      >
                        Mark {nextStatus}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <p className="p-8 text-center text-charcoal/40">No bookings match this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
