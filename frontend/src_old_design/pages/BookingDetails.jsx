import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookingById, cancelBooking } from "../api/bookings";
import { getVehicleById } from "../api/vehicles";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

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
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    try {
      await cancelBooking(id);
      loadBooking(); // refresh to show updated status
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!booking) return <div className="p-8">Loading...</div>;

  const canCancel = CANCELLABLE_STATUSES.includes(booking.booking_status);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
        <Link to="/my-bookings" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to my bookings
        </Link>

        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
          <span className={`text-sm px-3 py-1 rounded capitalize ${statusColors[booking.booking_status]}`}>
            {booking.booking_status}
          </span>
        </div>

        {vehicle && (
          <p className="text-gray-600 mb-4">{vehicle.name} — {vehicle.brand} {vehicle.model}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          <div><span className="text-gray-500">Start Date:</span> <span className="font-medium">{booking.start_date}</span></div>
          <div><span className="text-gray-500">End Date:</span> <span className="font-medium">{booking.end_date}</span></div>
          <div><span className="text-gray-500">Rental Days:</span> <span className="font-medium">{booking.rental_days}</span></div>
          <div><span className="text-gray-500">Price/Day:</span> <span className="font-medium">Rs. {booking.price_per_day}</span></div>
        </div>

        <p className="text-2xl font-bold text-blue-600 mb-6">Total: Rs. {booking.total_amount}</p>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}

        {!canCancel && (
          <p className="text-sm text-gray-400 text-center">
            This booking can no longer be cancelled.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookingDetails;