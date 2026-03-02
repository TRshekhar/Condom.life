import { useState, useEffect } from "react";
import { StarDisplay } from "../components/StarRating";
import { statsApi } from "../api";

const REGION_FLAGS = {
  Asia: "🌏", America: "🌎", Africa: "🌍", Australia: "🦘",
  Europe: "🏰", Russia: "🐻", India: "🪷", Global: "🌐",
  "Middle East": "🌙", "Latin America": "🌺",
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`bg-white border border-amber-100 rounded-2xl p-6 shadow-sm`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-2">{label}</p>
      <p className={`font-display text-4xl font-bold ${accent || "text-ink-900"}`}>{value}</p>
      {sub && <p className="text-sm text-ink-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi.getGlobal()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-cream-200 border-b border-amber-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-rose-brand text-sm font-semibold uppercase tracking-widest mb-2">
            Platform Insights
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-900">
            The Global Picture
          </h1>
          <p className="text-ink-500 mt-3">What the world is saying about protection.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-amber-100">
                <div className="h-3 shimmer rounded w-20 mb-3"></div>
                <div className="h-10 shimmer rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Reviews"
                value={stats.totalReviews.toLocaleString()}
                sub="from around the world"
                accent="text-rose-brand"
              />
              <StatCard
                label="Avg Rating"
                value={`${stats.avgRating}/5`}
                sub="community average"
                accent="text-amber-500"
              />
              <StatCard
                label="Brands Reviewed"
                value={stats.totalBrands}
                sub="distinct products"
                accent="text-ink-900"
              />
              <StatCard
                label="Regions Active"
                value={stats.regionBreakdown.length}
                sub="global coverage"
                accent="text-emerald-600"
              />
            </div>

            {/* Top Brands */}
            <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-6">
                Top Rated Brands
              </h2>
              <div className="space-y-4">
                {stats.topBrands.map((brand, i) => (
                  <div key={brand.brand_name} className="flex items-center gap-4">
                    <span className="font-display text-2xl font-bold text-ink-200 w-8">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-ink-900">{brand.brand_name}</p>
                        <span className="text-sm font-bold text-amber-600">
                          ★ {brand.avg_rating}
                        </span>
                      </div>
                      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                          style={{ width: `${(brand.avg_rating / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-ink-400 mt-1">{brand.reviews} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Region Breakdown */}
            <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-6">
                Reviews by Region
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.regionBreakdown.map((r) => {
                  const maxCount = stats.regionBreakdown[0]?.count || 1;
                  const pct = Math.round((r.count / maxCount) * 100);
                  return (
                    <div key={r.region} className="flex items-center gap-3">
                      <span className="text-xl w-8 flex-shrink-0 text-center">
                        {REGION_FLAGS[r.region] || "🌐"}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-ink-700">{r.region}</p>
                          <p className="text-sm text-ink-500">{r.count}</p>
                        </div>
                        <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-brand rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-ink-500 py-20">Could not load insights.</p>
        )}
      </div>
    </div>
  );
}