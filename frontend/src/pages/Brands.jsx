import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StarDisplay } from "../components/StarRating";
import { brandsApi } from "../api";

const CATEGORY_COLORS = {
  premium: "bg-amber-100 text-amber-800",
  standard: "bg-sky-100 text-sky-800",
  "latex-free": "bg-green-100 text-green-800",
  "ultra-thin": "bg-purple-100 text-purple-800",
};

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    brandsApi.getAll()
      .then((res) => setBrands(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(brands.map((b) => b.category))];
  const filtered = brands.filter((b) => filter === "all" || b.category === filter);

  return (
    <div className="page-enter min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-ink-900 to-ink-700 text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-cream-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Brand Directory
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Every Brand, Ranked
          </h1>
          <p className="text-cream-200 max-w-xl">
            Explore all brands reviewed on condom.life, sorted by community ratings and review count.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition-all ${
                filter === cat
                  ? "bg-ink-900 text-white border-ink-900"
                  : "border-amber-200 text-ink-600 hover:border-ink-900 bg-white"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-amber-100 space-y-3">
                <div className="h-5 shimmer rounded w-28"></div>
                <div className="h-3 shimmer rounded w-16"></div>
                <div className="h-3 shimmer rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((brand, i) => (
              <div
                key={brand.id}
                style={{ animationDelay: `${i * 40}ms`, opacity: 0 }}
                className="animate-fade-up"
              >
                <Link
                  to={`/?brand=${encodeURIComponent(brand.name)}`}
                  className="block bg-white border border-amber-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-ink-900 group-hover:text-rose-brand transition-colors">
                        {brand.name}
                      </h3>
                      <span
                        className={`badge mt-1 ${CATEGORY_COLORS[brand.category] || "bg-gray-100 text-gray-700"}`}
                      >
                        {brand.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-display text-ink-900">
                        {brand.avg_rating || "—"}
                      </p>
                      <p className="text-xs text-ink-400">/ 5.0</p>
                    </div>
                  </div>

                  {brand.avg_rating && (
                    <StarDisplay rating={Math.round(brand.avg_rating)} size="sm" />
                  )}

                  <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between">
                    <p className="text-xs text-ink-500">
                      {brand.review_count || 0} review{brand.review_count !== 1 ? "s" : ""}
                    </p>
                    <span className="text-xs text-rose-brand font-medium group-hover:underline">
                      View reviews →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-ink-500 py-16">No brands in this category yet.</p>
        )}
      </div>
    </div>
  );
}