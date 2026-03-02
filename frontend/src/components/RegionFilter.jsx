const REGIONS = [
  { label: "All", flag: "🌐" },
  { label: "Asia", flag: "🌏" },
  { label: "America", flag: "🌎" },
  { label: "Africa", flag: "🌍" },
  { label: "Australia", flag: "🦘" },
  { label: "Europe", flag: "🏰" },
  { label: "Russia", flag: "🐻" },
  { label: "India", flag: "🪷" },
  { label: "Middle East", flag: "🌙" },
  { label: "Latin America", flag: "🌺" },
  { label: "Global", flag: "🌐" },
];

export default function RegionFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {REGIONS.map(({ label, flag }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
            selected === label
              ? "bg-ink-900 text-white border-ink-900 shadow-md"
              : "bg-white border-amber-200 text-ink-600 hover:border-ink-900 hover:text-ink-900"
          }`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export { REGIONS };