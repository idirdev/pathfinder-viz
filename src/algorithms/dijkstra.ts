import { GridState, Step } from "@/lib/types";
import { getNeighbors } from "@/lib/grid";

interface QueueEntry {
  row: number;
  col: number;
  distance: number;
}

export function* dijkstra(grid: GridState): Generator<Step> {
  const [startRow, startCol] = grid.start;
  const [endRow, endCol] = grid.end;

  const key = (r: number, c: number) => `${r},${c}`;
  const dist = new Map<string, number>();
  const parent = new Map<string, string>();
  const visited = new Set<string>();

  // Simple priority queue using sorted array (sufficient for visualization)
  const pq: QueueEntry[] = [{ row: startRow, col: startCol, distance: 0 }];
  dist.set(key(startRow, startCol), 0);

  while (pq.length > 0) {
    // Extract min distance node
    let minIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      if (pq[i].distance < pq[minIdx].distance) {
        minIdx = i;
      }
    }
    const { row, col, distance } = pq.splice(minIdx, 1)[0];
    const ck = key(row, col);

    if (visited.has(ck)) continue;
    visited.add(ck);

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
      if (visited.has(nk) || neighbor.type === "wall") continue;

      const newDist = distance + 1;
      const oldDist = dist.get(nk) ?? Infinity;

      if (newDist < oldDist) {
        dist.set(nk, newDist);
        parent.set(nk, ck);
        pq.push({ row: neighbor.row, col: neighbor.col, distance: newDist });

        if (neighbor.type !== "end") {
          yield { row: neighbor.row, col: neighbor.col, type: "frontier" };
        }
      }
    }
  }
}
