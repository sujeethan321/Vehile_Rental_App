import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { getCategories } from "../api/vehicles";

const emptyForm = {
  name: "", brand: "", model: "", manufacturing_year: "",
  registration_number: "", category_id: "", transmission: "automatic",
  fuel_type: "petrol", seats: "", price_per_day: "", image_url: "",
  mileage: "", color: "",
};

const inputClass = "border border-charcoal/15 rounded-lg px-3 py-2 text-sm focus:border-sunset outline-none transition-colors bg-white";

function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadVehicles = () => {
    axiosClient.get("/vehicles/").then((res) => setVehicles(res.data));
  };

  useEffect(() => {
    loadVehicles();
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (vehicle) => {
    setForm({
      name: vehicle.name, brand: vehicle.brand, model: vehicle.model,
      manufacturing_year: vehicle.manufacturing_year, registration_number: vehicle.registration_number,
      category_id: vehicle.category_id || "", transmission: vehicle.transmission,
      fuel_type: vehicle.fuel_type, seats: vehicle.seats, price_per_day: vehicle.price_per_day,
      image_url: vehicle.image_url || "", mileage: vehicle.mileage || "", color: vehicle.color || "",
    });
    setEditingId(vehicle.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      manufacturing_year: Number(form.manufacturing_year),
      seats: Number(form.seats),
      price_per_day: Number(form.price_per_day),
      mileage: form.mileage ? Number(form.mileage) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
    };

    try {
      if (editingId) {
        await axiosClient.put(`/vehicles/${editingId}`, payload);
      } else {
        await axiosClient.post("/vehicles/", payload);
      }
      setShowForm(false);
      loadVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save vehicle");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete or deactivate this vehicle?")) return;
    try {
      await axiosClient.delete(`/vehicles/${id}`);
      loadVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete vehicle");
    }
  };

  const availabilityDot = {
    available: "bg-sage-dark",
    rented: "bg-sunset-dark",
    maintenance: "bg-yellow-500",
    inactive: "bg-charcoal/30",
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold mb-1">Fleet</h1>
            <p className="text-charcoal/50">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} total</p>
          </div>
          <button onClick={openAddForm} className="bg-sunset hover:bg-sunset-dark text-charcoal font-semibold px-5 py-2.5 rounded-full transition-colors">
            + Add vehicle
          </button>
        </div>

        {error && <p className="text-clay mb-4">{error}</p>}

        {showForm && (
          <div className="bg-white border border-charcoal/10 rounded-2xl p-6 mb-8">
            <h2 className="font-display text-lg font-semibold mb-4">{editingId ? "Edit vehicle" : "Add vehicle"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className={inputClass} required />
              <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className={inputClass} required />
              <input name="model" placeholder="Model" value={form.model} onChange={handleChange} className={inputClass} required />
              <input name="manufacturing_year" type="number" placeholder="Year" value={form.manufacturing_year} onChange={handleChange} className={inputClass} required />
              <input name="registration_number" placeholder="Registration No." value={form.registration_number} onChange={handleChange} className={`${inputClass} disabled:bg-charcoal/5 disabled:text-charcoal/40`} required disabled={!!editingId} />

              <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select name="transmission" value={form.transmission} onChange={handleChange} className={inputClass}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>

              <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className={inputClass}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>

              <input name="seats" type="number" placeholder="Seats" value={form.seats} onChange={handleChange} className={inputClass} required />
              <input name="price_per_day" type="number" step="0.01" placeholder="Price/day" value={form.price_per_day} onChange={handleChange} className={inputClass} required />
              <input name="mileage" type="number" placeholder="Mileage" value={form.mileage} onChange={handleChange} className={inputClass} />
              <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className={inputClass} />
              <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} className={`${inputClass} col-span-2`} />

              <div className="col-span-2 md:col-span-3 flex gap-3 mt-2">
                <button type="submit" className="bg-charcoal hover:bg-asphalt text-cream font-semibold px-5 py-2.5 rounded-full transition-colors">
                  {editingId ? "Update vehicle" : "Create vehicle"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-charcoal/15 hover:bg-charcoal/5 font-medium px-5 py-2.5 rounded-full transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-charcoal/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal/40 text-xs uppercase tracking-wide border-b border-charcoal/8">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Brand / Model</th>
                <th className="p-4 font-medium">Reg. No.</th>
                <th className="p-4 font-medium">Price/day</th>
                <th className="p-4 font-medium">Availability</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/60">
                  <td className="p-4 font-medium">{v.name}</td>
                  <td className="p-4 text-charcoal/60">{v.brand} {v.model}</td>
                  <td className="p-4 text-charcoal/60">{v.registration_number}</td>
                  <td className="p-4 font-medium">Rs. {v.price_per_day}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 capitalize text-charcoal/70">
                      <span className={`w-1.5 h-1.5 rounded-full ${availabilityDot[v.availability_status] || "bg-charcoal/30"}`}></span>
                      {v.availability_status}
                    </span>
                  </td>
                  <td className="p-4 capitalize text-charcoal/60">{v.vehicle_status}</td>
                  <td className="p-4 space-x-3 whitespace-nowrap">
                    <button onClick={() => openEditForm(v)} className="text-sunset-dark font-medium hover:underline">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-clay font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vehicles.length === 0 && (
            <p className="p-8 text-center text-charcoal/40">No vehicles yet — add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminVehicles;
