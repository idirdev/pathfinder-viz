export type CellType = "empty" | "wall" | "start" | "end" | "visited" | "path" | "frontier";

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  heuristic: number;
  parent: Cell | null;
}

export interface Step {
  row: number;
  col: number;
  type: "visited" | "path" | "frontier";
}

export type Algorithm = "bfs" | "dfs" | "dijkstra" | "astar";

export interface GridState {
  cells: Cell[][];
  rows: number;
  cols: number;
  start: [number, number];
  end: [number, number];
}

export interface AlgorithmResult {
  steps: Step[];
  pathLength: number;
  nodesVisited: number;
}
