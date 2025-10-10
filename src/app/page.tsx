"use client";

import { useState, useCallback, useRef } from "react";
import Grid from "@/components/Grid";
import Controls from "@/components/Controls";
import Legend from "@/components/Legend";
import { Algorithm, CellType, GridState, Step } from "@/lib/types";
import { createGrid, resetGrid, clearGrid } from "@/lib/grid";
import { buildMazeWalls } from "@/algorithms/maze";
import { bfs } from "@/algorithms/bfs";
import { dfs } from "@/algorithms/dfs";
import { dijkstra } from "@/algorithms/dijkstra";
import { astar } from "@/algorithms/astar";

const DEFAULT_SIZE = 25;
const DEFAULT_SPEED = 15;

export default function Home() {
  const [grid, setGrid] = useState<GridState>(() => createGrid(DEFAULT_SIZE, DEFAULT_SIZE));
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const [isRunning, setIsRunning] = useState(false);
  const [drawMode] = useState<CellType>("wall");
  const cancelRef = useRef(false);

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
    setGrid(createGrid(size, size));
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;
      setGrid((prev) => {
        const newCells = prev.cells.map((r) => r.map((c) => ({ ...c })));
        const cell = newCells[row][col];
        if (cell.type === "start" || cell.type === "end") return prev;
        cell.type = cell.type === "wall" ? "empty" : drawMode;
        return { ...prev, cells: newCells };
      });
    },
    [isRunning, drawMode]
  );

  const handleCellDrag = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;
      setGrid((prev) => {
        const cell = prev.cells[row][col];
        if (cell.type === "start" || cell.type === "end") return prev;
        const newCells = prev.cells.map((r) => r.map((c) => ({ ...c })));
        newCells[row][col].type = drawMode;
        return { ...prev, cells: newCells };
      });
    },
    [isRunning, drawMode]
  );

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleRun = useCallback(async () => {
    cancelRef.current = false;
    setIsRunning(true);

    const cleanGrid = resetGrid(grid);
    setGrid(cleanGrid);

    const algorithmFns: Record<Algorithm, (g: GridState) => Generator<Step>> = {
      bfs,
      dfs,
      dijkstra,
      astar,
    };

    const generator = algorithmFns[algorithm](cleanGrid);
    let currentGrid = { ...cleanGrid, cells: cleanGrid.cells.map((r) => r.map((c) => ({ ...c }))) };

    for (const step of generator) {
      if (cancelRef.current) break;

      const cell = currentGrid.cells[step.row][step.col];
      if (cell.type !== "start" && cell.type !== "end") {
        cell.type = step.type;
      }

      setGrid({
        ...currentGrid,
        cells: currentGrid.cells.map((r) => r.map((c) => ({ ...c }))),
      });

      await sleep(speed);
    }

    setIsRunning(false);
  }, [grid, algorithm, speed]);

  const handleGenerateMaze = useCallback(() => {
    const newGrid = createGrid(gridSize, gridSize);
    const { walls } = buildMazeWalls(gridSize, gridSize);

    const cells = newGrid.cells.map((r) => r.map((c) => ({ ...c })));
    for (const [wr, wc] of walls) {
      if (cells[wr][wc].type === "empty") {
        cells[wr][wc].type = "wall";
      }
    }

    setGrid({ ...newGrid, cells });
  }, [gridSize]);

  const handleClear = useCallback(() => {
    setGrid(clearGrid(grid));
  }, [grid]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    setIsRunning(false);
    setGrid(resetGrid(grid));
  }, [grid]);

  return (
    <main className="flex flex-col items-center gap-6 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
        Pathfinder Viz
      </h1>
      <p className="text-slate-400 text-sm text-center max-w-xl">
        Click to draw walls, then run an algorithm to find the shortest path.
        Drag to paint multiple walls. Generate a maze for an instant challenge.
      </p>

      <Controls
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        speed={speed}
        setSpeed={setSpeed}
        gridSize={gridSize}
        setGridSize={handleGridSizeChange}
        onRun={handleRun}
        onGenerateMaze={handleGenerateMaze}
        onClear={handleClear}
        onReset={handleReset}
        isRunning={isRunning}
      />

      <Legend />

      <div className="overflow-auto max-w-full">
        <Grid
          grid={grid}
          onCellClick={handleCellClick}
          onCellDrag={handleCellDrag}
          drawMode={drawMode}
        />
      </div>

      <footer className="text-xs text-slate-500 mt-4">
        Built by idirdev &mdash; BFS, DFS, Dijkstra, A* with recursive backtracking maze generation
      </footer>
    </main>
  );
}
