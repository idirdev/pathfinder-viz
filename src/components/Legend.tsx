"use client";

const legendItems = [
  { label: "Wall", className: "cell-wall" },
  { label: "Start", className: "cell-start" },
  { label: "End", className: "cell-end" },
  { label: "Visited", className: "cell-visited" },
  { label: "Path", className: "cell-path" },
  { label: "Frontier", className: "cell-frontier" },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap gap-4 justify-center py-3">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-sm border border-slate-600 ${item.className}`}
          />
          <span className="text-sm text-slate-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
