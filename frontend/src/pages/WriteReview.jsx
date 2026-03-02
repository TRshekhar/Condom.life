import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarInput } from "../components/StarRating";
import { reviewsApi, brandsApi } from "../api";
import { REGIONS } from "../components/RegionFilter";
import toast from "react-hot-toast";

export default function WriteReview() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    brand_name: "",
    customBrand: "",
    title: "",
    content: "",
    rating: 0,
    region: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    brandsApi.getAll().then((res) => setBrands(res.data.data)).catch(() => {});
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target ? e.target.value : e,
    }));

  const validate = () => {
    const errs = {};
    if (!form.username.trim() || form.username.trim().length < 2)
      errs.username = "At least 2 characters";
    const brand = form.brand_name === "__custom__" ? form.customBrand : form.brand_name;
    if (!brand.trim()) errs.brand_name = "Please select or enter a brand";
    if (!form.title.trim() || form.title.trim().length < 5)
      errs.title = "At least 5 characters";
    if (!form.content.trim() || form.content.trim().length < 20)
      errs.content = "At least 20 characters";
    if (!form.rating) errs.rating = "Please give a star rating";
    if (!form.region) errs.region = "Please select your region";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const payload = {
      username: form.username.trim(),
      brand_name:
        form.brand_name === "__custom__"
          ? form.customBrand.trim()
          : form.brand_name,
      title: form.title.trim(),
      content: form.content.trim(),
      rating: form.rating,
      region: form.region,
    };

    try {
      await reviewsApi.create(payload);
      toast.success("Review published! Thank you 🎉");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = form.content.length;
  const maxChars = 1200;

  return (
    <div className="page-enter min-h-screen bg-cream-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-rose-brand text-sm font-semibold uppercase tracking-widest mb-2">
            Share Your Experience
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-900 leading-tight">
            Write a Review
          </h1>
          <p className="mt-3 text-ink-500">
            Your honest opinion helps people around the world make informed choices.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Your Username <span className="text-rose-brand">*</span>
            </label>
            <input
              type="text"
              value={form.username}
              onChange={set("username")}
              placeholder="e.g. SafeInSeoul"
              maxLength={40}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm transition-colors ${
                errors.username ? "border-red-400" : "border-amber-200"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Brand <span className="text-rose-brand">*</span>
            </label>
            <select
              value={form.brand_name}
              onChange={set("brand_name")}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm transition-colors ${
                errors.brand_name ? "border-red-400" : "border-amber-200"
              }`}
            >
              <option value="">Select a brand…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                  {b.avg_rating ? ` — ★ ${b.avg_rating}` : ""}
                </option>
              ))}
              <option value="__custom__">Other (type your own)</option>
            </select>
            {form.brand_name === "__custom__" && (
              <input
                type="text"
                value={form.customBrand}
                onChange={set("customBrand")}
                placeholder="Enter brand name"
                className="mt-2 w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm"
              />
            )}
            {errors.brand_name && (
              <p className="mt-1 text-xs text-red-500">{errors.brand_name}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Rating <span className="text-rose-brand">*</span>
            </label>
            <div className="bg-white border border-amber-200 rounded-xl p-4">
              <StarInput value={form.rating} onChange={(v) => set("rating")(v)} />
            </div>
            {errors.rating && (
              <p className="mt-1 text-xs text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Review Title <span className="text-rose-brand">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="Summarize your experience in a headline…"
              maxLength={120}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm transition-colors ${
                errors.title ? "border-red-400" : "border-amber-200"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Your Review <span className="text-rose-brand">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) set("content")(e);
              }}
              rows={6}
              placeholder="Tell the world about your experience — what did you love, what could be better? Be honest and specific."
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm resize-none transition-colors leading-relaxed ${
                errors.content ? "border-red-400" : "border-amber-200"
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.content ? (
                <p className="text-xs text-red-500">{errors.content}</p>
              ) : (
                <span />
              )}
              <p className={`text-xs ${charCount > maxChars * 0.9 ? "text-amber-500" : "text-ink-400"}`}>
                {charCount}/{maxChars}
              </p>
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Your Region <span className="text-rose-brand">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONS.filter((r) => r.label !== "All").map(({ label, flag }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => set("region")(label)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.region === label
                      ? "bg-ink-900 text-white border-ink-900 shadow-md"
                      : "bg-white border-amber-200 text-ink-600 hover:border-ink-900 hover:text-ink-900"
                  }`}
                >
                  <span>{flag}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {errors.region && (
              <p className="mt-1 text-xs text-red-500">{errors.region}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-amber-100">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-full font-semibold text-white bg-rose-brand hover:bg-rose-dark transition-all shadow-lg hover:shadow-rose-brand/30 hover:-translate-y-0.5 active:translate-y-0 text-base ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Publishing…" : "Publish Review →"}
            </button>
            <p className="mt-3 text-center text-xs text-ink-400">
              By submitting, you agree that your review is honest and your own.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}