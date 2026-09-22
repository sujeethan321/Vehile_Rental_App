import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const statusStyles = {
  active: "bg-sage/20 text-sage-dark",
  inactive: "bg-clay/10 text-clay",
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

  useEffect(() => {
    loadCustomers();
  }, []);

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
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-semibold mb-1">Customers</h1>
        <p className="text-charcoal/50 mb-8">{customers.length} registered customer{customers.length !== 1 ? "s" : ""}.</p>

        {error && <p className="text-clay mb-4">{error}</p>}

        <div className="relative max-w-sm mb-6">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/30" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full border border-charcoal/15 rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-sunset outline-none transition-colors bg-white"
          />
        </div>

        <div className="bg-white border border-charcoal/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal/40 text-xs uppercase tracking-wide border-b border-charcoal/8">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/60">
                  <td className="p-4">#{c.id}</td>
                  <td className="p-4 font-medium">{c.full_name}</td>
                  <td className="p-4 text-charcoal/60">{c.email}</td>
                  <td className="p-4 text-charcoal/60">{c.phone || "—"}</td>
                  <td className="p-4 text-charcoal/60">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[c.account_status]}`}>
                      {c.account_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      disabled={updatingId === c.id}
                      onClick={() => handleToggleStatus(c.id, c.account_status)}
                      className={`font-medium hover:underline disabled:opacity-50 ${
                        c.account_status === "active" ? "text-clay" : "text-sage-dark"
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
            <p className="p-8 text-center text-charcoal/40">No customers match this search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCustomers;
