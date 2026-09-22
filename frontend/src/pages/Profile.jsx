import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await axiosClient.put("/auth/me", { full_name: fullName, phone });
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="max-w-lg mx-auto px-6 py-16 text-charcoal/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream flex justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-sunset/15 border border-sunset/30 flex items-center justify-center text-sunset-dark font-display font-semibold text-xl">
            {user.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">{user.full_name}</h1>
            <p className="text-charcoal/45 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="bg-white border border-charcoal/10 rounded-2xl p-6">
          {message && (
            <div className="bg-sage/10 border border-sage/30 text-sage-dark text-sm rounded-lg px-4 py-3 mb-5">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-clay/10 border border-clay/25 text-clay text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-charcoal/15 rounded-lg px-4 py-2.5 focus:border-sunset outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-charcoal/15 rounded-lg px-4 py-2.5 focus:border-sunset outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-charcoal hover:bg-asphalt text-cream font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        <div className="flex justify-between text-sm text-charcoal/45 mt-6 px-2">
          <span>Account status: <span className="font-medium text-charcoal/70 capitalize">{user.account_status}</span></span>
          <span>Since {new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
