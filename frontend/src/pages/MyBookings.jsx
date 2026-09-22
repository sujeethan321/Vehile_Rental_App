import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../api/bookings";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-sage/20 text-sage-dark",
  completed: "bg-charcoal/10 text-charcoal/50",
  cancelled: "bg-clay/10 text-clay",
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data.sort((a, b) => b.id - a.id)))
      .catch(() => setError("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-semibold mb-1">My Trips</h1>
        <p className="text-charcoal/50 mb-8">Everything you've booked, in one place.</p>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-sand rounded-2xl animate-pulse"></div>
            ))}
          </div>
        )}

        {error && <p className="text-clay">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-16 bg-white border border-charcoal/10 rounded-2xl">
            <p className="text-charcoal/50 mb-4">You haven't booked anything yet.</p>
            <Link to="/vehicles" className="inline-block bg-sunset hover:bg-sunset-dark text-charcoal font-semibold px-6 py-2.5 rounded-full transition-colors">
              Browse the fleet
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link
              to={`/my-bookings/${booking.id}`}
              key={booking.id}
              className="block bg-white border border-charcoal/10 hover:border-charcoal/25 rounded-2xl p-5 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-display font-semibold mb-1">Booking #{booking.id}</p>
                  <p className="text-sm text-charcoal/50">
                    {booking.start_date} &rarr; {booking.end_date}
                    <span className="text-charcoal/30"> &middot; {booking.rental_days} day{booking.rental_days > 1 ? "s" : ""}</span>
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${statusStyles[booking.booking_status]}`}>
                  {booking.booking_status}
                </span>
              </div>
              <div className="flex justify-between items-end mt-3 pt-3 border-t border-charcoal/8">
                <span className="font-display font-semibold text-lg">Rs. {booking.total_amount}</span>
                <span className="text-sunset-dark text-sm font-medium">Details</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
