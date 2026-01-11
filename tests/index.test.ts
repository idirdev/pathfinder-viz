import { describe, it, expect } from 'vitest';
import { createCell, createGrid, getNeighbors, resetGrid, clearGrid } from '../src/lib/grid';
import type { GridState, Cell, CellType } from '../src/lib/types';

describe('createCell', () => {
  it('should create a cell with default empty type', () => {
    const cell = createCell(0, 0);
    expect(cell.row).toBe(0);
    expect(cell.col).toBe(0);
    expect(cell.type).toBe('empty');
    expect(cell.distance).toBe(Infinity);
    expect(cell.heuristic).toBe(0);
    expect(cell.parent).toBeNull();
  });

  it('should create a cell with custom type', () => {
    const cell = createCell(2, 3, 'wall');
    expect(cell.row).toBe(2);
    expect(cell.col).toBe(3);
    expect(cell.type).toBe('wall');
  });

  it('should create cells of different types', () => {
    expect(createCell(0, 0, 'start').type).toBe('start');
    expect(createCell(0, 0, 'end').type).toBe('end');
    expect(createCell(0, 0, 'visited').type).toBe('visited');
    expect(createCell(0, 0, 'path').type).toBe('path');
    expect(createCell(0, 0, 'frontier').type).toBe('frontier');
  });
});

describe('createGrid', () => {
  it('should create a grid with the correct dimensions', () => {
    const grid = createGrid(10, 15);
    expect(grid.rows).toBe(10);
    expect(grid.cols).toBe(15);
    expect(grid.cells).toHaveLength(10);
    expect(grid.cells[0]).toHaveLength(15);
  });

  it('should set start and end positions', () => {
    const grid = createGrid(10, 20);
    const [startRow, startCol] = grid.start;
    const [endRow, endCol] = grid.end;

    expect(grid.cells[startRow][startCol].type).toBe('start');
    expect(grid.cells[endRow][endCol].type).toBe('end');
  });

  it('should place start at middle-left and end at middle-right', () => {
    const grid = createGrid(20, 20);
    const [startRow, startCol] = grid.start;
    const [endRow, endCol] = grid.end;

    // Start should be at vertical center, left quarter
    expect(startRow).toBe(10); // Math.floor(20/2)
    expect(startCol).toBe(5);  // Math.floor(20/4)

    // End should be at vertical center, right three-quarters
    expect(endRow).toBe(10);   // Math.floor(20/2)
    expect(endCol).toBe(15);   // Math.floor(3*20/4)
  });

  it('should initialize all non-start/end cells as empty', () => {
    const grid = createGrid(5, 5);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = grid.cells[r][c];
        if (cell.type !== 'start' && cell.type !== 'end') {
          expect(cell.type).toBe('empty');
        }
      }
    }
  });
});

describe('getNeighbors', () => {
  let grid: GridState;

  beforeEach(() => {
    // Create a small 5x5 grid for testing
    grid = createGrid(5, 5);
  });

  it('should return 4 neighbors for a center cell', () => {
    const neighbors = getNeighbors(grid, 2, 2);
    expect(neighbors).toHaveLength(4);
  });

  it('should return 2 neighbors for a corner cell', () => {
    const neighbors = getNeighbors(grid, 0, 0);
    expect(neighbors).toHaveLength(2);
    // Should be (0,1) and (1,0)
    const coords = neighbors.map(n => `${n.row},${n.col}`);
    expect(coords).toContain('0,1');
    expect(coords).toContain('1,0');
  });

  it('should return 3 neighbors for an edge cell', () => {
    const neighbors = getNeighbors(grid, 0, 2);
    expect(neighbors).toHaveLength(3);
  });

  it('should return correct neighbor cells', () => {
    const neighbors = getNeighbors(grid, 2, 2);
    const coords = neighbors.map(n => `${n.row},${n.col}`);
    expect(coords).toContain('1,2'); // up
    expect(coords).toContain('3,2'); // down
    expect(coords).toContain('2,1'); // left
    expect(coords).toContain('2,3'); // right
  });

  it('should not include diagonal neighbors', () => {
    const neighbors = getNeighbors(grid, 2, 2);
    const coords = neighbors.map(n => `${n.row},${n.col}`);
    expect(coords).not.toContain('1,1');
    expect(coords).not.toContain('1,3');
    expect(coords).not.toContain('3,1');
    expect(coords).not.toContain('3,3');
  });
});

describe('resetGrid', () => {
  it('should clear visited, path, and frontier cells to empty', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].type = 'visited';
    grid.cells[1][2].type = 'path';
    grid.cells[1][3].type = 'frontier';

    const reset = resetGrid(grid);
    expect(reset.cells[1][1].type).toBe('empty');
    expect(reset.cells[1][2].type).toBe('empty');
    expect(reset.cells[1][3].type).toBe('empty');
  });

  it('should preserve walls', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].type = 'wall';

    const reset = resetGrid(grid);
    expect(reset.cells[1][1].type).toBe('wall');
  });

  it('should preserve start and end cells', () => {
    const grid = createGrid(5, 5);
    const [startRow, startCol] = grid.start;
    const [endRow, endCol] = grid.end;

    const reset = resetGrid(grid);
    expect(reset.cells[startRow][startCol].type).toBe('start');
    expect(reset.cells[endRow][endCol].type).toBe('end');
  });

  it('should reset distance and heuristic values', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].distance = 5;
    grid.cells[1][1].heuristic = 3;

    const reset = resetGrid(grid);
    expect(reset.cells[1][1].distance).toBe(Infinity);
    expect(reset.cells[1][1].heuristic).toBe(0);
  });

  it('should reset parent references', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].parent = grid.cells[0][0];

    const reset = resetGrid(grid);
    expect(reset.cells[1][1].parent).toBeNull();
  });

  it('should not mutate the original grid', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].type = 'visited';

    resetGrid(grid);
    expect(grid.cells[1][1].type).toBe('visited'); // original unchanged
  });
});

describe('clearGrid', () => {
  it('should clear all non-start/end cells to empty', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].type = 'wall';
    grid.cells[1][2].type = 'visited';
    grid.cells[1][3].type = 'path';

    const cleared = clearGrid(grid);
    expect(cleared.cells[1][1].type).toBe('empty');
    expect(cleared.cells[1][2].type).toBe('empty');
    expect(cleared.cells[1][3].type).toBe('empty');
  });

  it('should preserve start and end cells', () => {
    const grid = createGrid(5, 5);
    const [startRow, startCol] = grid.start;
    const [endRow, endCol] = grid.end;

    const cleared = clearGrid(grid);
    expect(cleared.cells[startRow][startCol].type).toBe('start');
    expect(cleared.cells[endRow][endCol].type).toBe('end');
  });

  it('should remove walls (unlike resetGrid)', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].type = 'wall';

    const cleared = clearGrid(grid);
    expect(cleared.cells[1][1].type).toBe('empty');
  });

  it('should reset distance and heuristic values', () => {
    const grid = createGrid(5, 5);
    grid.cells[1][1].distance = 10;
    grid.cells[1][1].heuristic = 5;

    const cleared = clearGrid(grid);
    expect(cleared.cells[1][1].distance).toBe(Infinity);
    expect(cleared.cells[1][1].heuristic).toBe(0);
  });
});

describe('Grid integration', () => {
  it('should support a workflow of create, modify, reset, clear', () => {
    // Create grid
    const grid = createGrid(10, 10);
    expect(grid.rows).toBe(10);
    expect(grid.cols).toBe(10);

    // Add walls
    grid.cells[3][3].type = 'wall';
    grid.cells[3][4].type = 'wall';
    grid.cells[3][5].type = 'wall';

    // Add visit markers
    grid.cells[1][1].type = 'visited';
    grid.cells[1][2].type = 'frontier';

    // Reset should clear visited/frontier but keep walls
    const reset = resetGrid(grid);
    expect(reset.cells[3][3].type).toBe('wall');
    expect(reset.cells[1][1].type).toBe('empty');
    expect(reset.cells[1][2].type).toBe('empty');

    // Clear should remove everything except start/end
    const cleared = clearGrid(grid);
    expect(cleared.cells[3][3].type).toBe('empty');

    const [sr, sc] = grid.start;
    const [er, ec] = grid.end;
    expect(cleared.cells[sr][sc].type).toBe('start');
    expect(cleared.cells[er][ec].type).toBe('end');
  });
});
