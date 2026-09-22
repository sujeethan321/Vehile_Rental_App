import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? "text-sunset" : "text-cream/80 hover:text-cream"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-sunset">
              <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2.5" y="13" width="19" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="7" cy="19.5" r="1.5" fill="currentColor"/>
              <circle cx="17" cy="19.5" r="1.5" fill="currentColor"/>
            </svg>
            <span className="font-display font-semibold text-lg text-cream">Wayfare</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/vehicles" className={linkClass("/vehicles")}>Browse Fleet</Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/my-bookings" className={linkClass("/my-bookings")}>My Trips</Link>
                <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className={linkClass("/admin")}>Dashboard</Link>
                <Link to="/admin/vehicles" className={linkClass("/admin/vehicles")}>Fleet</Link>
                <Link to="/admin/bookings" className={linkClass("/admin/bookings")}>Bookings</Link>
                <Link to="/admin/customers" className={linkClass("/admin/customers")}>Customers</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-sm font-medium text-cream/80 hover:text-cream">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-sunset hover:bg-sunset-dark text-charcoal font-semibold text-sm px-4 py-2 rounded-full transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sunset/20 border border-sunset/40 flex items-center justify-center text-sunset text-xs font-semibold font-display">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-cream/70">{user?.full_name?.split(" ")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-cream/60 hover:text-cream border border-white/15 hover:border-white/30 px-3 py-1.5 rounded-full transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-cream"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-charcoal border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          <Link to="/vehicles" onClick={() => setMenuOpen(false)} className={linkClass("/vehicles")}>Browse Fleet</Link>
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className={linkClass("/my-bookings")}>My Trips</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className={linkClass("/profile")}>Profile</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className={linkClass("/admin")}>Dashboard</Link>
              <Link to="/admin/vehicles" onClick={() => setMenuOpen(false)} className={linkClass("/admin/vehicles")}>Fleet</Link>
              <Link to="/admin/bookings" onClick={() => setMenuOpen(false)} className={linkClass("/admin/bookings")}>Bookings</Link>
              <Link to="/admin/customers" onClick={() => setMenuOpen(false)} className={linkClass("/admin/customers")}>Customers</Link>
            </>
          )}
          {!isAuthenticated ? (
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-cream/80">Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-sunset text-charcoal font-semibold text-center px-4 py-2 rounded-full">
                Get Started
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-left text-cream/60 pt-3 border-t border-white/10">
              Log out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
