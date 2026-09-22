import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-charcoal text-cream p-12">
        <Link to="/" className="font-display font-semibold text-lg">Wayfare</Link>
        <div>
          <h2 className="font-display text-3xl font-semibold mb-3 max-w-xs">
            Good to see you back on the road.
          </h2>
          <p className="text-cream/60 max-w-xs">
            Log in to manage your trips, track bookings, and pick up right where you left off.
          </p>
        </div>
        <p className="text-cream/40 text-sm">Wayfare Vehicle Rentals</p>
      </div>

      <div className="flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold mb-1">Log in</h1>
          <p className="text-charcoal/50 text-sm mb-8">Enter your details to continue.</p>

          {error && (
            <div className="bg-clay/10 border border-clay/25 text-clay text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-charcoal/15 rounded-lg px-4 py-2.5 bg-white focus:border-sunset outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-charcoal/15 rounded-lg px-4 py-2.5 bg-white focus:border-sunset outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-asphalt text-cream font-semibold py-3 rounded-full transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-charcoal/60 mt-6 text-center">
            New to Wayfare?{" "}
            <Link to="/register" className="text-sunset-dark font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
