import { GridState, Step } from "@/lib/types";

/**
 * Recursive backtracking maze generator.
 * Starts with all walls, carves passages by visiting random neighbors.
 * Yields steps so the maze generation can be animated.
 */
export function* generateMaze(rows: number, cols: number): Generator<Step> {
  // Ensure odd dimensions for proper maze walls
  const mazeRows = rows % 2 === 0 ? rows - 1 : rows;
  const mazeCols = cols % 2 === 0 ? cols - 1 : cols;

  // First yield all cells as walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      yield { row: r, col: c, type: "visited" }; // "visited" signals wall placement
    }
  }

  const visited = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;

  function getUnvisitedNeighbors(r: number, c: number): [number, number][] {
    const dirs: [number, number][] = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ];
    const result: [number, number][] = [];

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < mazeRows && nc >= 0 && nc < mazeCols && !visited.has(key(nr, nc))) {
        result.push([nr, nc]);
      }
    }

    return result;
  }

  function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Iterative DFS using explicit stack to avoid call stack overflow
  const startR = 1;
  const startC = 1;
  visited.add(key(startR, startC));
  yield { row: startR, col: startC, type: "path" }; // "path" signals passage

  const stack: [number, number][] = [[startR, startC]];

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    const neighbors = shuffle(getUnvisitedNeighbors(cr, cc));

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const [nr, nc] = neighbors[0];
    visited.add(key(nr, nc));

    // Carve wall between current and neighbor
    const wallR = (cr + nr) / 2;
    const wallC = (cc + nc) / 2;
    yield { row: wallR, col: wallC, type: "path" };
    yield { row: nr, col: nc, type: "path" };

    stack.push([nr, nc]);
  }
}

/**
 * Applies maze generator results to a grid state.
 * Returns arrays of wall and passage coordinates.
 */
export function buildMazeWalls(rows: number, cols: number): {
  walls: [number, number][];
  passages: [number, number][];
} {
  const walls: [number, number][] = [];
  const passages: [number, number][] = [];
  const gen = generateMaze(rows, cols);

  const wallPhase = new Set<string>();
  const passagePhase = new Set<string>();

  for (const step of gen) {
    const k = `${step.row},${step.col}`;
    if (step.type === "visited") {
      wallPhase.add(k);
    } else if (step.type === "path") {
      passagePhase.add(k);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = `${r},${c}`;
      if (passagePhase.has(k)) {
        passages.push([r, c]);
      } else {
        walls.push([r, c]);
      }
    }
  }

  return { walls, passages };
}
