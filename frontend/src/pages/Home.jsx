import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import RegionFilter from "../components/RegionFilter";
import { reviewsApi } from "../api";

const SORT_OPTIONS = [
  { value: "newest", label: "✦ Newest" },
  { value: "top_rated", label: "★ Top Rated" },
  { value: "most_liked", label: "❤ Most Liked" },
];

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [region, setRegion] = useState("All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.getAll({ region, sort, page, search, limit: 9 });
      setReviews(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [region, sort, page, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [region, sort, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="page-enter min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-rose-brand blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-500 blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-rose-light text-sm font-semibold uppercase tracking-widest mb-4">
              The World's Honest Review Platform
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Real opinions.{" "}
              <span className="italic text-cream-400">Real moments.</span>
            </h1>
            <p className="text-cream-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              Share your experience with your favourite protection. Rate, review, and discover what
              people across the globe are using — filtered by your region.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/write"
                className="px-6 py-3 bg-rose-brand text-white rounded-full font-semibold hover:bg-rose-dark transition-all shadow-lg hover:shadow-rose-brand/30 hover:-translate-y-0.5"
              >
                Write a Review
              </Link>
              <Link
                to="/brands"
                className="px-6 py-3 bg-white/10 backdrop-blur text-white rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Browse Brands
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-16 z-40 bg-cream-100/95 backdrop-blur border-b border-amber-200/60 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by brand, title, or keyword…"
              className="w-full sm:w-96 pl-10 pr-4 py-2.5 text-sm bg-white border border-amber-200 rounded-full focus:border-rose-brand transition-colors"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">🔍</span>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 text-xs"
              >
                ✕
              </button>
            )}
          </form>

          {/* Region filter */}
          <div className="overflow-x-auto scrollbar-hide">
            <RegionFilter selected={region} onChange={(r) => { setRegion(r); }} />
          </div>

          {/* Sort + count */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-ink-500">
              {loading ? "Loading…" : `${total} review${total !== 1 ? "s" : ""}`}
              {region !== "All" && ` in ${region}`}
            </p>
            <div className="flex gap-1">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSort(value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    sort === value
                      ? "bg-ink-900 text-white"
                      : "text-ink-500 hover:text-ink-900 hover:bg-cream-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 shimmer rounded w-24"></div>
                    <div className="h-2.5 shimmer rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 shimmer rounded w-full"></div>
                  <div className="h-3 shimmer rounded w-5/6"></div>
                  <div className="h-3 shimmer rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="font-display text-2xl font-bold text-ink-900 mb-2">
              No reviews found
            </h3>
            <p className="text-ink-500 mb-6">
              {search ? `No results for "${search}"` : `No reviews from ${region} yet`}
            </p>
            <Link
              to="/write"
              className="px-6 py-3 bg-rose-brand text-white rounded-full font-semibold hover:bg-rose-dark transition-all"
            >
              Be the first to review
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                  className="animate-fade-up"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-full border border-amber-200 text-sm font-medium text-ink-600 hover:border-ink-900 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                        p === page
                          ? "bg-ink-900 text-white shadow-md"
                          : "border border-amber-200 text-ink-600 hover:border-ink-900 hover:text-ink-900"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-full border border-amber-200 text-sm font-medium text-ink-600 hover:border-ink-900 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}