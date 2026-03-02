import { useState } from "react";

export function StarDisplay({ rating, size = "md" }) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl", xl: "text-4xl" };
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`${sizes[size]} ${i <= rating ? "text-amber-400" : "text-amber-200"}`}
      >
        ★
      </span>
    );
  }
  return <span className="inline-flex gap-0.5">{stars}</span>;
}

export function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`star text-3xl transition-colors leading-none ${
            (hovered || value) >= star ? "text-amber-400" : "text-amber-200"
          }`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 self-center text-sm font-medium text-ink-600">
          {["", "Poor", "Fair", "Good", "Great", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}