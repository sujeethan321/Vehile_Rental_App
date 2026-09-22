import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-7xl font-semibold text-charcoal/15 mb-4">404</p>
      <h1 className="font-display text-2xl font-semibold mb-2">This road doesn't go anywhere</h1>
      <p className="text-charcoal/50 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="bg-sunset hover:bg-sunset-dark text-charcoal font-semibold px-6 py-3 rounded-full transition-colors">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
