import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVehicles, getCategories } from "../api/vehicles";

function VehicleCard({ vehicle }) {
  const isAvailable = vehicle.availability_status === "available";
  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-charcoal/8 hover:border-charcoal/20 hover:shadow-lg hover:shadow-charcoal/5 transition-all"
    >
      <div className="relative h-44 bg-sand overflow-hidden">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2.5" y="13" width="19" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur ${
            isAvailable ? "bg-sage/90 text-white" : "bg-charcoal/70 text-cream"
          }`}
        >
          {isAvailable ? "Available" : vehicle.availability_status}
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-display font-semibold text-charcoal leading-tight">{vehicle.name}</h3>
        </div>
        <p className="text-charcoal/45 text-sm mb-3">{vehicle.brand} &middot; {vehicle.manufacturing_year}</p>

        <div className="flex items-center gap-3 text-xs text-charcoal/50 mb-3">
          <span className="capitalize">{vehicle.transmission}</span>
          <span className="w-1 h-1 rounded-full bg-charcoal/20"></span>
          <span className="capitalize">{vehicle.fuel_type}</span>
          <span className="w-1 h-1 rounded-full bg-charcoal/20"></span>
          <span>{vehicle.seats} seats</span>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-charcoal/8">
          <div>
            <span className="font-display text-lg font-semibold text-charcoal">Rs. {vehicle.price_per_day}</span>
            <span className="text-charcoal/40 text-xs"> /day</span>
          </div>
          <span className="text-sunset-dark text-sm font-medium group-hover:translate-x-0.5 transition-transform">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [filters, setFilters] = useState({
    brand: "",
    category_id: "",
    min_price: "",
    max_price: "",
    transmission: "",
    fuel_type: "",
    seats: "",
    availability_status: "",
    search: "",
  });

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

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

  const toggleCategory = (id) => {
    setFilters({ ...filters, category_id: filters.category_id === String(id) ? "" : String(id) });
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v !== "" && k !== "search"
  ).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header / search bar */}
      <div className="bg-charcoal text-cream">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-8">
          <h1 className="font-display text-3xl font-semibold mb-1">Browse the fleet</h1>
          <p className="text-cream/50 mb-6">Find the right vehicle for your next trip.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                name="search"
                placeholder="Search by name, brand, or model"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full bg-white/10 border border-white/15 rounded-full pl-11 pr-4 py-3 text-cream placeholder:text-cream/40 focus:bg-white/15 outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 rounded-full px-5 py-3 text-sm font-medium transition-colors"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-sunset text-charcoal text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 mt-5 overflow-x-auto chip-scroll pb-1">
            <button
              onClick={() => setFilters({ ...filters, category_id: "" })}
              className={`shrink-0 text-sm px-4 py-2 rounded-full border transition-colors ${
                filters.category_id === ""
                  ? "bg-sunset border-sunset text-charcoal font-medium"
                  : "border-white/15 text-cream/70 hover:border-white/30"
              }`}
            >
              All types
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`shrink-0 text-sm px-4 py-2 rounded-full border transition-colors ${
                  filters.category_id === String(cat.id)
                    ? "bg-sunset border-sunset text-charcoal font-medium"
                    : "border-white/15 text-cream/70 hover:border-white/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable filters */}
      {showMoreFilters && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-white border border-charcoal/10 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="text" name="brand" placeholder="Brand" value={filters.brand}
              onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none"
            />
            <select name="transmission" value={filters.transmission} onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none">
              <option value="">Any transmission</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
            <select name="fuel_type" value={filters.fuel_type} onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none">
              <option value="">Any fuel type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
            <select name="availability_status" value={filters.availability_status} onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none">
              <option value="">Any availability</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <input
              type="number" name="min_price" placeholder="Min price/day" value={filters.min_price}
              onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none"
            />
            <input
              type="number" name="max_price" placeholder="Max price/day" value={filters.max_price}
              onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none"
            />
            <input
              type="number" name="seats" placeholder="Seats" value={filters.seats}
              onChange={handleFilterChange}
              className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none"
            />
            <button
              onClick={() => setFilters({ brand: "", category_id: "", min_price: "", max_price: "", transmission: "", fuel_type: "", seats: "", availability_status: "", search: filters.search })}
              className="text-sm text-clay font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-sand animate-pulse"></div>
            ))}
          </div>
        )}

        {error && <p className="text-clay">{error}</p>}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-charcoal/50 mb-2">No vehicles match your filters.</p>
            <p className="text-charcoal/30 text-sm">Try widening your search.</p>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <>
            <p className="text-charcoal/50 text-sm mb-4">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VehicleList;
