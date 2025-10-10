"use client";

import { useCallback, useRef } from "react";
import { CellType, GridState } from "@/lib/types";

interface GridProps {
  grid: GridState;
  onCellClick: (row: number, col: number) => void;
  onCellDrag: (row: number, col: number) => void;
  drawMode: CellType;
}

export default function Grid({ grid, onCellClick, onCellDrag, drawMode }: GridProps) {
  const isDrawing = useRef(false);

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      isDrawing.current = true;
      onCellClick(row, col);
    },
    [onCellClick]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isDrawing.current) {
        onCellDrag(row, col);
      }
    },
    [onCellDrag]
  );

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const getCellClass = (type: CellType): string => {
    switch (type) {
      case "wall":
        return "cell-wall";
      case "start":
        return "cell-start";
      case "end":
        return "cell-end";
      case "visited":
        return "cell-visited";
      case "path":
        return "cell-path";
      case "frontier":
        return "cell-frontier";
      default:
        return "cell-empty";
    }
  };

  return (
    <div
      className="inline-block border border-slate-700 rounded select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="grid"
      aria-label={`Pathfinding grid, ${grid.rows} rows by ${grid.cols} columns. Draw mode: ${drawMode}`}
    >
      {grid.cells.map((row, r) => (
        <div key={r} className="flex" role="row">
          {row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`cell ${getCellClass(cell.type)}`}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
              role="gridcell"
              aria-label={`Row ${r + 1}, Column ${c + 1}: ${cell.type}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
