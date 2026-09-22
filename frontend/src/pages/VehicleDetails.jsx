import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVehicleById } from "../api/vehicles";
import { useAuth } from "../context/AuthContext";

function Spec({ label, value }) {
  return (
    <div className="border-b border-charcoal/8 py-3 flex justify-between text-sm">
      <span className="text-charcoal/45">{label}</span>
      <span className="font-medium text-charcoal capitalize">{value}</span>
    </div>
  );
}

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getVehicleById(id)
      .then((res) => setVehicle(res.data))
      .catch(() => setError("Vehicle not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/book/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="h-96 bg-sand rounded-2xl animate-pulse"></div>
      </div>
    );
  }
  if (error) return <div className="max-w-7xl mx-auto px-6 py-16 text-clay">{error}</div>;
  if (!vehicle) return null;

  const isBookable = vehicle.vehicle_status === "active" && vehicle.availability_status === "available";

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/vehicles" className="inline-flex items-center gap-1.5 text-charcoal/50 hover:text-charcoal text-sm mb-6 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to fleet
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Image + info */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden bg-sand h-80 md:h-[26rem] mb-6">
              {vehicle.image_url ? (
                <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="2.5" y="13" width="19" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
              )}
            </div>

            <p className="text-sunset-dark text-sm font-medium mb-1">{vehicle.brand}</p>
            <h1 className="font-display text-3xl font-semibold mb-4">{vehicle.name}</h1>

            <div className="grid sm:grid-cols-2 gap-x-8">
              <div>
                <Spec label="Model" value={vehicle.model} />
                <Spec label="Year" value={vehicle.manufacturing_year} />
                <Spec label="Transmission" value={vehicle.transmission} />
                <Spec label="Fuel type" value={vehicle.fuel_type} />
              </div>
              <div>
                <Spec label="Seats" value={vehicle.seats} />
                <Spec label="Color" value={vehicle.color || "N/A"} />
                <Spec label="Mileage" value={vehicle.mileage != null ? `${vehicle.mileage} km` : "N/A"} />
                <Spec label="Registration" value={vehicle.registration_number} />
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white border border-charcoal/10 rounded-2xl p-6">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-3xl font-semibold">Rs. {vehicle.price_per_day}</span>
                <span className="text-charcoal/40 text-sm">/ day</span>
              </div>

              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-6 ${
                  isBookable ? "bg-sage/15 text-sage-dark" : "bg-charcoal/10 text-charcoal/50"
                }`}
              >
                {isBookable ? "Available now" : `Unavailable — ${vehicle.availability_status}`}
              </span>

              <button
                onClick={handleBookNow}
                disabled={!isBookable}
                className={`w-full py-3.5 rounded-full font-semibold transition-colors ${
                  isBookable
                    ? "bg-sunset hover:bg-sunset-dark text-charcoal"
                    : "bg-charcoal/10 text-charcoal/35 cursor-not-allowed"
                }`}
              >
                {isBookable ? "Book this vehicle" : "Not available"}
              </button>

              {!isAuthenticated && isBookable && (
                <p className="text-xs text-charcoal/40 text-center mt-3">
                  You'll be asked to log in first.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
