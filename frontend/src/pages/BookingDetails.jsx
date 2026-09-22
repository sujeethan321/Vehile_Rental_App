import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookingById, cancelBooking } from "../api/bookings";
import { getVehicleById } from "../api/vehicles";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-sage/20 text-sage-dark",
  completed: "bg-charcoal/10 text-charcoal/50",
  cancelled: "bg-clay/10 text-clay",
};

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadBooking = () => {
    getBookingById(id)
      .then((res) => {
        setBooking(res.data);
        return getVehicleById(res.data.vehicle_id);
      })
      .then((res) => setVehicle(res.data))
      .catch(() => setError("Booking not found"));
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(id);
      setShowConfirm(false);
      loadBooking();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  if (error) return <div className="max-w-lg mx-auto px-6 py-16 text-clay">{error}</div>;
  if (!booking) return <div className="max-w-lg mx-auto px-6 py-16 text-charcoal/50">Loading...</div>;

  const canCancel = CANCELLABLE_STATUSES.includes(booking.booking_status);

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to="/my-bookings" className="inline-flex items-center gap-1.5 text-charcoal/50 hover:text-charcoal text-sm mb-6 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to my trips
        </Link>

        <div className="bg-white border border-charcoal/10 rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-charcoal/40 text-sm mb-1">Booking</p>
              <h1 className="font-display text-2xl font-semibold">#{booking.id}</h1>
            </div>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${statusStyles[booking.booking_status]}`}>
              {booking.booking_status}
            </span>
          </div>

          {vehicle && (
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-charcoal/8">
              {vehicle.image_url ? (
                <img src={vehicle.image_url} alt={vehicle.name} className="w-20 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-20 h-16 bg-sand rounded-lg"></div>
              )}
              <div>
                <p className="font-display font-semibold">{vehicle.name}</p>
                <p className="text-charcoal/45 text-sm">{vehicle.brand} {vehicle.model}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-6">
            <div><span className="text-charcoal/45 block">Start date</span><span className="font-medium">{booking.start_date}</span></div>
            <div><span className="text-charcoal/45 block">End date</span><span className="font-medium">{booking.end_date}</span></div>
            <div><span className="text-charcoal/45 block">Rental days</span><span className="font-medium">{booking.rental_days}</span></div>
            <div><span className="text-charcoal/45 block">Price / day</span><span className="font-medium">Rs. {booking.price_per_day}</span></div>
          </div>

          <div className="flex justify-between items-baseline pt-4 border-t border-charcoal/8 mb-6">
            <span className="text-charcoal/50">Total</span>
            <span className="font-display text-2xl font-semibold">Rs. {booking.total_amount}</span>
          </div>

          {canCancel && !showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full border border-clay/40 text-clay hover:bg-clay/5 py-3 rounded-full font-semibold transition-colors"
            >
              Cancel booking
            </button>
          )}

          {showConfirm && (
            <div className="bg-clay/5 border border-clay/20 rounded-xl p-4">
              <p className="text-sm text-charcoal/70 mb-3">Cancel this booking? This can't be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 bg-clay hover:bg-clay/90 text-white py-2.5 rounded-full font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Yes, cancel"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 border border-charcoal/15 py-2.5 rounded-full font-semibold text-sm hover:bg-charcoal/5 transition-colors"
                >
                  Keep booking
                </button>
              </div>
            </div>
          )}

          {!canCancel && (
            <p className="text-sm text-charcoal/35 text-center">
              This booking can no longer be cancelled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
