import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVehicleById } from "../api/vehicles";
import { createBooking } from "../api/bookings";

function BookingForm() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getVehicleById(vehicleId)
      .then((res) => setVehicle(res.data))
      .catch(() => setError("Vehicle not found"));
  }, [vehicleId]);

  // Live-calculated estimate (server recalculates for real on submit)
  const estimatedDays =
    startDate && endDate
      ? Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
      : 0;

  const estimatedTotal =
    vehicle && estimatedDays > 0 ? (vehicle.price_per_day * estimatedDays).toFixed(2) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be on or after start date");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createBooking(Number(vehicleId), startDate, endDate);
      navigate(`/my-bookings/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !vehicle) return <div className="p-8 text-red-500">{error}</div>;
  if (!vehicle) return <div className="p-8">Loading...</div>;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
        <Link to={`/vehicles/${vehicleId}`} className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to vehicle
        </Link>

        <h1 className="text-2xl font-bold mb-2">Book {vehicle.name}</h1>
        <p className="text-gray-500 mb-6">Rs. {vehicle.price_per_day} / day</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />

          {estimatedTotal && (
            <div className="bg-blue-50 rounded p-4 mb-6">
              <p className="text-sm text-gray-600">{estimatedDays} day(s) × Rs. {vehicle.price_per_day}</p>
              <p className="text-xl font-bold text-blue-700">Estimated Total: Rs. {estimatedTotal}</p>
              <p className="text-xs text-gray-400 mt-1">Final amount is confirmed by the server</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;