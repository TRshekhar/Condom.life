import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-amber-200/60 bg-cream-100/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-rose-brand flex items-center justify-center text-white font-bold text-sm leading-none shadow-md group-hover:scale-105 transition-transform">
              ♡
            </div>
            <span className="font-display font-bold text-xl text-ink-900">
              condom<span className="text-rose-brand">.life</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              to="/"
              className={`nav-link text-sm font-medium transition-colors ${
                isActive("/") ? "text-rose-brand active" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Reviews
            </Link>
            <Link
              to="/brands"
              className={`nav-link text-sm font-medium transition-colors ${
                isActive("/brands") ? "text-rose-brand active" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Brands
            </Link>
            <Link
              to="/stats"
              className={`nav-link text-sm font-medium transition-colors ${
                isActive("/stats") ? "text-rose-brand active" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Insights
            </Link>
            <Link
              to="/write"
              className="px-4 py-2 rounded-full bg-rose-brand text-white text-sm font-semibold hover:bg-rose-dark transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              + Write Review
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg text-ink-600 hover:text-ink-900 hover:bg-cream-200"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-amber-200/60 py-4 space-y-3 animate-fade-up">
            {[
              { to: "/", label: "Reviews" },
              { to: "/brands", label: "Brands" },
              { to: "/stats", label: "Insights" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium px-2 py-1 ${
                  isActive(to) ? "text-rose-brand" : "text-ink-600"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/write"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-4 py-2 rounded-full bg-rose-brand text-white text-sm font-semibold"
            >
              + Write Review
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}