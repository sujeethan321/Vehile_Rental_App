import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVehicles, getCategories } from "../api/vehicles";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    brand: "",
    category_id: "",
    min_price: "",
    max_price: "",
    transmission: "",
    fuel_type: "",
    seats: "",
    availability_status: "available",
    search: "",
  });

  // Load categories once, for the filter dropdown
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Load vehicles whenever filters change
  useEffect(() => {
    setLoading(true);
    setError("");
    getVehicles(filters)
      .then((res) => setVehicles(res.data))
      .catch(() => setError("Failed to load vehicles"))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Vehicles</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search name/brand/model"
          value={filters.search}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        <select
          name="category_id"
          value={filters.category_id}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          name="transmission"
          value={filters.transmission}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Any Transmission</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>

        <select
          name="fuel_type"
          value={filters.fuel_type}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Any Fuel Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </select>

        <input
          type="number"
          name="min_price"
          placeholder="Min price/day"
          value={filters.min_price}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          name="max_price"
          placeholder="Max price/day"
          value={filters.max_price}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={filters.seats}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Results */}
      {loading && <p>Loading vehicles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && vehicles.length === 0 && (
        <p className="text-gray-500">No vehicles match your filters.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Link
            to={`/vehicles/${vehicle.id}`}
            key={vehicle.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 block"
          >
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <h2 className="text-lg font-semibold">{vehicle.name}</h2>
            <p className="text-gray-500 text-sm">{vehicle.brand} · {vehicle.model} · {vehicle.manufacturing_year}</p>
            <p className="text-blue-600 font-bold mt-2">Rs. {vehicle.price_per_day} / day</p>
            <p className="text-sm text-gray-500 capitalize">{vehicle.transmission} · {vehicle.fuel_type} · {vehicle.seats} seats</p>

            <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
              vehicle.availability_status === "available"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {vehicle.availability_status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default VehicleList;