import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
};

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadCustomers = (searchTerm = "") => {
    const params = searchTerm ? { search: searchTerm } : {};
    axiosClient
      .get("/users/", { params })
      .then((res) => setCustomers(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Failed to load customers"));
  };

  // Initial load
  useEffect(() => {
    loadCustomers();
  }, []);

  // Debounced search: waits 400ms after typing stops before hitting the API
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setError("");
    setUpdatingId(customerId);
    try {
      await axiosClient.put(`/users/${customerId}/status`, { account_status: newStatus });
      loadCustomers(search);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update customer status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">#{c.id}</td>
                <td className="p-3">{c.full_name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone || "—"}</td>
                <td className="p-3">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[c.account_status]}`}>
                    {c.account_status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    disabled={updatingId === c.id}
                    onClick={() => handleToggleStatus(c.id, c.account_status)}
                    className={`hover:underline disabled:opacity-50 ${
                      c.account_status === "active" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {c.account_status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="p-6 text-gray-500 text-center">No customers match this search.</p>
        )}
      </div>
    </div>
  );
}

export default AdminCustomers;