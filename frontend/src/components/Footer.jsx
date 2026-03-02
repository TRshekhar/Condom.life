import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-amber-200 bg-ink-900 text-cream-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-rose-brand flex items-center justify-center text-white text-xs font-bold">
                ♡
              </div>
              <span className="font-display font-bold text-xl text-white">
                condom<span className="text-rose-light">.life</span>
              </span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed">
              The world's most honest platform for real opinions about protection. Safe, anonymous, global.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cream-400 mb-3">Platform</p>
            <ul className="space-y-2">
              {[
                { to: "/", label: "All Reviews" },
                { to: "/brands", label: "Brand Directory" },
                { to: "/stats", label: "Global Insights" },
                { to: "/write", label: "Write a Review" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-cream-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cream-400 mb-3">Browse By Region</p>
            <div className="flex flex-wrap gap-2">
              {["Asia", "America", "Europe", "Africa", "India", "Australia", "Russia"].map((r) => (
                <Link
                  key={r}
                  to={`/?region=${r}`}
                  className="text-xs px-2.5 py-1 rounded-full border border-cream-400/30 text-cream-300 hover:border-rose-brand hover:text-rose-light transition-colors"
                >
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream-200/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-400">
            © {new Date().getFullYear()} condom.life · All reviews are user-generated opinions.
          </p>
          <p className="text-xs text-cream-400">
            Built for a healthier, more open world 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}