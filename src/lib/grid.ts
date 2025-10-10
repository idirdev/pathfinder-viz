import { Cell, CellType, GridState } from "./types";

export function createCell(row: number, col: number, type: CellType = "empty"): Cell {
  return {
    row,
    col,
    type,
    distance: Infinity,
    heuristic: 0,
    parent: null,
  };
}

export function createGrid(rows: number, cols: number): GridState {
  const cells: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(createCell(r, c));
    }
    cells.push(row);
  }

  const startRow = Math.floor(rows / 2);
  const startCol = Math.floor(cols / 4);
  const endRow = Math.floor(rows / 2);
  const endCol = Math.floor((3 * cols) / 4);

  cells[startRow][startCol].type = "start";
  cells[endRow][endCol].type = "end";

  return {
    cells,
    rows,
    cols,
    start: [startRow, startCol],
    end: [endRow, endCol],
  };
}

export function getNeighbors(grid: GridState, row: number, col: number): Cell[] {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const neighbors: Cell[] = [];
  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols) {
      neighbors.push(grid.cells[nr][nc]);
    }
  }
  return neighbors;
}

export function resetGrid(grid: GridState): GridState {
  const cells = grid.cells.map((row) =>
    row.map((cell) => ({
      ...cell,
      distance: Infinity,
      heuristic: 0,
      parent: null,
      type: cell.type === "visited" || cell.type === "path" || cell.type === "frontier"
        ? ("empty" as CellType)
        : cell.type,
    }))
  );

  return { ...grid, cells };
}

export function clearGrid(grid: GridState): GridState {
  const cells = grid.cells.map((row) =>
    row.map((cell) => ({
      ...cell,
      distance: Infinity,
      heuristic: 0,
      parent: null,
      type:
        cell.type === "start"
          ? ("start" as CellType)
          : cell.type === "end"
            ? ("end" as CellType)
            : ("empty" as CellType),
    }))
  );

  return { ...grid, cells };
}
