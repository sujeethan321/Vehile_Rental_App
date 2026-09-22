import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

// Defines which status changes make sense from each current status
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
    axiosClient.get("/bookings/").then((res) => setBookings(res.data));
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Customer ID</th>
              <th className="p-3">Vehicle ID</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Days</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">#{b.id}</td>
                <td className="p-3">{b.customer_id}</td>
                <td className="p-3">{b.vehicle_id}</td>
                <td className="p-3">{b.start_date} → {b.end_date}</td>
                <td className="p-3">{b.rental_days}</td>
                <td className="p-3">Rs. {b.total_amount}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[b.booking_status]}`}>
                    {b.booking_status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {NEXT_STATUS_OPTIONS[b.booking_status].length === 0 && (
                    <span className="text-gray-400 text-xs">No actions</span>
                  )}
                  {NEXT_STATUS_OPTIONS[b.booking_status].map((nextStatus) => (
                    <button
                      key={nextStatus}
                      disabled={updatingId === b.id}
                      onClick={() => handleStatusChange(b.id, nextStatus)}
                      className="text-blue-600 hover:underline capitalize disabled:opacity-50"
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
          <p className="p-6 text-gray-500 text-center">No bookings match this filter.</p>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;