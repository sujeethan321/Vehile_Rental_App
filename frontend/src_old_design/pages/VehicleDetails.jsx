import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVehicleById } from "../api/vehicles";
import { useAuth } from "../context/AuthContext";

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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!vehicle) return null;

  const isBookable = vehicle.vehicle_status === "active" && vehicle.availability_status === "available";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/vehicles" className="text-blue-600 text-sm mb-4 inline-block">← Back to vehicles</Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full md:w-1/2 h-72 object-cover"
          />
        ) : (
          <div className="w-full md:w-1/2 h-72 bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <div className="p-6 md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{vehicle.name}</h1>
          <p className="text-gray-500 mb-4">{vehicle.brand} · {vehicle.model} · {vehicle.manufacturing_year}</p>

          <p className="text-3xl font-bold text-blue-600 mb-4">
            Rs. {vehicle.price_per_day} <span className="text-base font-normal text-gray-500">/ day</span>
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            <div><span className="text-gray-500">Transmission:</span> <span className="capitalize font-medium">{vehicle.transmission}</span></div>
            <div><span className="text-gray-500">Fuel Type:</span> <span className="capitalize font-medium">{vehicle.fuel_type}</span></div>
            <div><span className="text-gray-500">Seats:</span> <span className="font-medium">{vehicle.seats}</span></div>
            <div><span className="text-gray-500">Color:</span> <span className="font-medium">{vehicle.color || "N/A"}</span></div>
            <div><span className="text-gray-500">Mileage:</span> <span className="font-medium">{vehicle.mileage ?? "N/A"} km</span></div>
            <div><span className="text-gray-500">Registration:</span> <span className="font-medium">{vehicle.registration_number}</span></div>
          </div>

          <span className={`inline-block mb-4 text-sm px-3 py-1 rounded ${
            isBookable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
            {isBookable ? "Available for booking" : `Unavailable (${vehicle.availability_status})`}
          </span>

          <button
            onClick={handleBookNow}
            disabled={!isBookable}
            className={`w-full py-3 rounded font-semibold ${
              isBookable
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isBookable ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;