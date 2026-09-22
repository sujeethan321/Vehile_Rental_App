import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Vehicle Rental
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/vehicles" className="text-gray-700 hover:text-blue-600">Browse Vehicles</Link>

        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600">My Bookings</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/admin/vehicles" className="text-gray-700 hover:text-blue-600">Vehicles</Link>
            <Link to="/admin/bookings" className="text-gray-700 hover:text-blue-600">Bookings</Link>
            <Link to="/admin/customers" className="text-gray-700 hover:text-blue-600">Customers</Link>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Register
            </Link>
          </>
        )}

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Hi, {user?.full_name?.split(" ")[0]}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;