import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { getCategories } from "../api/vehicles";

const emptyForm = {
  name: "", brand: "", model: "", manufacturing_year: "",
  registration_number: "", category_id: "", transmission: "automatic",
  fuel_type: "petrol", seats: "", price_per_day: "", image_url: "",
  mileage: "", color: "",
};

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Vehicles</h1>
        <button onClick={openAddForm} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Vehicle
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="model" placeholder="Model" value={form.model} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="manufacturing_year" type="number" placeholder="Year" value={form.manufacturing_year} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="registration_number" placeholder="Registration No." value={form.registration_number} onChange={handleChange} className="border rounded px-3 py-2" required disabled={!!editingId} />

            <select name="category_id" value={form.category_id} onChange={handleChange} className="border rounded px-3 py-2">
              <option value="">No Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select name="transmission" value={form.transmission} onChange={handleChange} className="border rounded px-3 py-2">
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>

            <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className="border rounded px-3 py-2">
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>

            <input name="seats" type="number" placeholder="Seats" value={form.seats} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="price_per_day" type="number" step="0.01" placeholder="Price/Day" value={form.price_per_day} onChange={handleChange} className="border rounded px-3 py-2" required />
            <input name="mileage" type="number" placeholder="Mileage" value={form.mileage} onChange={handleChange} className="border rounded px-3 py-2" />
            <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border rounded px-3 py-2" />
            <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />

            <div className="col-span-2 md:col-span-3 flex gap-3 mt-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                {editingId ? "Update Vehicle" : "Create Vehicle"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Brand/Model</th>
              <th className="p-3">Reg No.</th>
              <th className="p-3">Price/Day</th>
              <th className="p-3">Availability</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.brand} {v.model}</td>
                <td className="p-3">{v.registration_number}</td>
                <td className="p-3">Rs. {v.price_per_day}</td>
                <td className="p-3 capitalize">{v.availability_status}</td>
                <td className="p-3 capitalize">{v.vehicle_status}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => openEditForm(v)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminVehicles;