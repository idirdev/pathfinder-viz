import { GridState, Step } from "@/lib/types";
import { getNeighbors } from "@/lib/grid";

interface AStarEntry {
  row: number;
  col: number;
  g: number;
  f: number;
}

function manhattan(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

export function* astar(grid: GridState): Generator<Step> {
  const [startRow, startCol] = grid.start;
  const [endRow, endCol] = grid.end;

  const key = (r: number, c: number) => `${r},${c}`;
  const gScore = new Map<string, number>();
  const parent = new Map<string, string>();
  const visited = new Set<string>();

  const h = (r: number, c: number) => manhattan(r, c, endRow, endCol);

  const openSet: AStarEntry[] = [
    { row: startRow, col: startCol, g: 0, f: h(startRow, startCol) },
  ];
  gScore.set(key(startRow, startCol), 0);

  while (openSet.length > 0) {
    // Find node with lowest f score
    let minIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[minIdx].f) {
        minIdx = i;
      }
    }
    const current = openSet.splice(minIdx, 1)[0];
    const { row, col, g } = current;
    const ck = key(row, col);

    if (visited.has(ck)) continue;
    visited.add(ck);

    if (row === endRow && col === endCol) {
      let cur = key(endRow, endCol);
      const startKey = key(startRow, startCol);
      while (cur !== startKey) {
        const [pr, pc] = cur.split(",").map(Number);
        if (cur !== key(endRow, endCol)) {
          yield { row: pr, col: pc, type: "path" };
        }
        cur = parent.get(cur)!;
      }
      return;
    }

    if (row !== startRow || col !== startCol) {
      yield { row, col, type: "visited" };
    }

    const neighbors = getNeighbors(grid, row, col);
    for (const neighbor of neighbors) {
      const nk = key(neighbor.row, neighbor.col);
      if (visited.has(nk) || neighbor.type === "wall") continue;

      const tentativeG = g + 1;
      const oldG = gScore.get(nk) ?? Infinity;

      if (tentativeG < oldG) {
        gScore.set(nk, tentativeG);
        parent.set(nk, ck);
        const f = tentativeG + h(neighbor.row, neighbor.col);
        openSet.push({ row: neighbor.row, col: neighbor.col, g: tentativeG, f });

        if (neighbor.type !== "end") {
          yield { row: neighbor.row, col: neighbor.col, type: "frontier" };
        }
      }
    }
  }
}
