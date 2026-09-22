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
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : detail || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !vehicle) return <div className="max-w-xl mx-auto px-6 py-16 text-clay">{error}</div>;
  if (!vehicle) return <div className="max-w-xl mx-auto px-6 py-16 text-charcoal/50">Loading...</div>;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to={`/vehicles/${vehicleId}`} className="inline-flex items-center gap-1.5 text-charcoal/50 hover:text-charcoal text-sm mb-6 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to vehicle
        </Link>

        <div className="bg-white border border-charcoal/10 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-charcoal/8">
            {vehicle.image_url ? (
              <img src={vehicle.image_url} alt={vehicle.name} className="w-20 h-16 object-cover rounded-lg" />
            ) : (
              <div className="w-20 h-16 bg-sand rounded-lg"></div>
            )}
            <div>
              <h1 className="font-display text-xl font-semibold">{vehicle.name}</h1>
              <p className="text-charcoal/45 text-sm">Rs. {vehicle.price_per_day} / day</p>
            </div>
          </div>

          {error && (
            <div className="bg-clay/10 border border-clay/25 text-clay text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 focus:border-sunset outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">End date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 focus:border-sunset outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {estimatedTotal && (
              <div className="bg-sand rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm text-charcoal/60 mb-1">
                  <span>{estimatedDays} day{estimatedDays > 1 ? "s" : ""} &times; Rs. {vehicle.price_per_day}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-display text-2xl font-semibold text-charcoal">Rs. {estimatedTotal}</span>
                  <span className="text-xs text-charcoal/40">confirmed by server</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sunset hover:bg-sunset-dark text-charcoal py-3.5 rounded-full font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
