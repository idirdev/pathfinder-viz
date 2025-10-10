import { GridState, Step } from "@/lib/types";
import { getNeighbors } from "@/lib/grid";

export function* dfs(grid: GridState): Generator<Step> {
  const [startRow, startCol] = grid.start;
  const [endRow, endCol] = grid.end;

  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const stack: [number, number][] = [[startRow, startCol]];
  const key = (r: number, c: number) => `${r},${c}`;

  visited.add(key(startRow, startCol));

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;

    if (row === endRow && col === endCol) {
      let current = key(endRow, endCol);
      const startKey = key(startRow, startCol);
      while (current !== startKey) {
        const [pr, pc] = current.split(",").map(Number);
        if (current !== key(endRow, endCol)) {
          yield { row: pr, col: pc, type: "path" };
        }
        current = parent.get(current)!;
      }
      return;
    }

    if (row !== startRow || col !== startCol) {
      yield { row, col, type: "visited" };
    }

    const neighbors = getNeighbors(grid, row, col);
    for (const neighbor of neighbors) {
      const nk = key(neighbor.row, neighbor.col);
      if (!visited.has(nk) && neighbor.type !== "wall") {
        visited.add(nk);
        parent.set(nk, key(row, col));
        stack.push([neighbor.row, neighbor.col]);

        if (neighbor.type !== "end") {
          yield { row: neighbor.row, col: neighbor.col, type: "frontier" };
        }
      }
    }
  }
}
