import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { StarDisplay } from "./StarRating";
import { reviewsApi } from "../api";
import toast from "react-hot-toast";

const REGION_FLAGS = {
  Asia: "🌏",
  America: "🌎",
  Africa: "🌍",
  Australia: "🦘",
  Europe: "🏰",
  Russia: "🐻",
  India: "🪷",
  Global: "🌐",
  "Middle East": "🌙",
  "Latin America": "🌺",
};

export default function ReviewCard({ review, onLikeUpdate }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(review.likes || 0);
  const [liking, setLiking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const flag = REGION_FLAGS[review.region] || "🌐";
  const isLong = review.content.length > 280;
  const displayContent =
    expanded || !isLong ? review.content : review.content.slice(0, 280) + "…";

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await reviewsApi.like(review.id);
      setLiked(res.data.liked);
      setLikes(res.data.likes);
      if (res.data.liked) toast.success("Liked!", { icon: "❤️", duration: 1500 });
    } catch {
      toast.error("Couldn't like this review");
    } finally {
      setLiking(false);
    }
  };

  return (
    <article className="review-card bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner flex-shrink-0"
            style={{
              background: `hsl(${(review.username.charCodeAt(0) * 15) % 360}, 60%, 55%)`,
            }}
          >
            {review.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-ink-900 text-sm">{review.username}</p>
            <p className="text-xs text-ink-500 flex items-center gap-1.5">
              <span>{flag}</span>
              <span>{review.region}</span>
              <span className="text-amber-300">·</span>
              <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
            </p>
          </div>
        </div>

        {/* Brand badge */}
        <div className="flex flex-col items-end gap-1">
          <span className="px-3 py-1 bg-rose-pale rounded-full text-rose-brand text-xs font-semibold">
            {review.brand_name}
          </span>
          <div
            className={`badge rating-${review.rating}`}
          >
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} {review.rating}/5
          </div>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-3">
        <StarDisplay rating={review.rating} size="md" />
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-lg text-ink-900 mb-2 leading-tight">
        {review.title}
      </h3>

      {/* Content */}
      <p className="text-ink-600 text-sm leading-relaxed mb-4">
        {displayContent}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-rose-brand font-medium hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-amber-100">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            liked
              ? "bg-rose-pale border-rose-brand text-rose-brand"
              : "border-amber-200 text-ink-500 hover:border-rose-brand hover:text-rose-brand hover:bg-rose-pale"
          } ${liking ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <span>{liked ? "❤️" : "♡"}</span>
          <span>{likes}</span>
        </button>

        <span className="text-xs text-ink-400 font-mono">#{review.id}</span>
      </div>
    </article>
  );
}