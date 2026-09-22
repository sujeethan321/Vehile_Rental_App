import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../api/bookings";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">You have no bookings yet. <Link to="/vehicles" className="text-blue-600">Browse vehicles</Link></p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Link
            to={`/my-bookings/${booking.id}`}
            key={booking.id}
            className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Booking #{booking.id}</p>
                <p className="text-sm text-gray-500">
                  {booking.start_date} → {booking.end_date} ({booking.rental_days} day{booking.rental_days > 1 ? "s" : ""})
                </p>
                <p className="text-blue-600 font-bold mt-1">Rs. {booking.total_amount}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[booking.booking_status] || "bg-gray-100"}`}>
                {booking.booking_status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;