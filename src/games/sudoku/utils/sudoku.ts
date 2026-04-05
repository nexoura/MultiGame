export type Difficulty = 'easy' | 'medium' | 'hard';

export type SudokuBoard = (number | null)[][];

/**
 * Checks if a number can be placed at board[row][col] without violating Sudoku rules.
 */
export const isValid = (board: SudokuBoard, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

/**
 * Solves the Sudoku board using backtracking with shuffled number order.
 * Modifies the board in place if found.
 */
export const solve = (board: SudokuBoard, shuffle = false): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (shuffle) {
          // Shuffle for random board generation
          for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
          }
        }
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board, shuffle)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

/**
 * Counts the number of solutions for a board, stopping early once count exceeds limit.
 * Returns count (capped at limit + 1).
 */
const countSolutions = (board: SudokuBoard, limit = 1): number => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        let count = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            count += countSolutions(board, limit - count);
            board[row][col] = null;
            if (count > limit) return count; // early exit
          }
        }
        return count;
      }
    }
  }
  return 1; // all cells filled = 1 solution
};

/**
 * Generates a full valid Sudoku board with randomized numbers.
 */
export const generateFullBoard = (): SudokuBoard => {
  const board: SudokuBoard = Array.from({ length: 9 }, () => Array(9).fill(null));

  // Fill the diagonal 3x3 boxes first (they are independent)
  for (let i = 0; i < 9; i += 3) {
    fillBox(board, i, i);
  }

  solve(board, true);
  return board;
};

const fillBox = (board: SudokuBoard, row: number, col: number) => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Shuffle nums
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let idx = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = nums[idx++];
    }
  }
};

/**
 * Generates a puzzle by removing numbers from a full board based on difficulty.
 * Guarantees a UNIQUE solution so user answers are never incorrectly marked wrong.
 */
export const generatePuzzle = (difficulty: Difficulty): { puzzle: SudokuBoard; solution: SudokuBoard } => {
  const solution = generateFullBoard();

  // Deep-copy the solution into the puzzle
  const puzzle: SudokuBoard = solution.map(row => [...row]);

  let cellsToRemove = 0;
  switch (difficulty) {
    case 'easy':   cellsToRemove = 36; break; // ~45 clues left
    case 'medium': cellsToRemove = 46; break; // ~35 clues left
    case 'hard':   cellsToRemove = 54; break; // ~27 clues left
  }

  // Build a shuffled list of all 81 cell positions
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break;

    const backup = puzzle[r][c];
    puzzle[r][c] = null;

    // Check that the puzzle still has exactly 1 solution
    const copy: SudokuBoard = puzzle.map(row => [...row]);
    const solutions = countSolutions(copy, 1);

    if (solutions === 1) {
      removed++;
    } else {
      // Removing this cell creates ambiguity — put it back
      puzzle[r][c] = backup;
    }
  }

  return { puzzle, solution };
};
