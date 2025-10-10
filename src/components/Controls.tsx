"use client";

import { Algorithm } from "@/lib/types";

interface ControlsProps {
  algorithm: Algorithm;
  setAlgorithm: (algo: Algorithm) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  onRun: () => void;
  onGenerateMaze: () => void;
  onClear: () => void;
  onReset: () => void;
  isRunning: boolean;
}

const algorithms: { value: Algorithm; label: string }[] = [
  { value: "bfs", label: "BFS (Breadth-First)" },
  { value: "dfs", label: "DFS (Depth-First)" },
  { value: "dijkstra", label: "Dijkstra" },
  { value: "astar", label: "A* (Manhattan)" },
];

export default function Controls({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  gridSize,
  setGridSize,
  onRun,
  onGenerateMaze,
  onClear,
  onReset,
  isRunning,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      {/* Algorithm select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-wider">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          disabled={isRunning}
          className="bg-slate-700 text-slate-200 rounded px-3 py-1.5 text-sm border border-slate-600 focus:outline-none focus:border-indigo-500"
        >
          {algorithms.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Speed slider */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-wider">
          Speed: {speed}ms
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-28 accent-indigo-500"
        />
      </div>

      {/* Grid size slider */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-wider">
          Grid: {gridSize}x{gridSize}
        </label>
        <input
          type="range"
          min={11}
          max={51}
          step={2}
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          disabled={isRunning}
          className="w-28 accent-indigo-500"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={onGenerateMaze}
          disabled={isRunning}
          className="px-4 py-1.5 rounded text-sm font-medium bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Generate Maze
        </button>
        <button
          onClick={onReset}
          disabled={isRunning}
          className="px-4 py-1.5 rounded text-sm font-medium bg-slate-600 hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Reset Path
        </button>
        <button
          onClick={onClear}
          disabled={isRunning}
          className="px-4 py-1.5 rounded text-sm font-medium bg-slate-600 hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-5 py-1.5 rounded text-sm font-semibold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}
