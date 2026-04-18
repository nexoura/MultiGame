import { Board, PlayerColor, Position, Piece, Move, GameState, PieceType, BOARD_SIZE } from './chessConstants';

/**
 * Validates if a position is within the board boundaries.
 */
export const isWithinBoard = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
};

/**
 * Gets a piece at a position.
 */
export const getPieceAt = (board: Board, pos: Position): Piece | null => {
  if (!isWithinBoard(pos)) return null;
  return board[pos.row][pos.col];
};

/**
 * Checks if a square is empty.
 */
export const isEmpty = (board: Board, pos: Position): boolean => {
  return getPieceAt(board, pos) === null;
};

/**
 * Checks if a square is occupied by an enemy.
 */
export const isEnemy = (board: Board, pos: Position, myColor: PlayerColor): boolean => {
  const piece = getPieceAt(board, pos);
  return piece !== null && piece.color !== myColor;
};

/**
 * Generates all pseudo-legal moves for a piece at a given position.
 * Pseudo-legal moves include moves that might leave the king in check.
 */
export const getPseudoLegalMoves = (board: Board, pos: Position, state: GameState): Move[] => {
  const piece = getPieceAt(board, pos);
  if (!piece) return [];

  const moves: Move[] = [];
  const { type, color } = piece;

  switch (type) {
    case 'pawn':
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      // Move forward 1
      const forward1 = { row: pos.row + direction, col: pos.col };
      if (isWithinBoard(forward1) && isEmpty(board, forward1)) {
        moves.push({ from: pos, to: forward1, piece });

        // Move forward 2
        if (pos.row === startRow) {
          const forward2 = { row: pos.row + 2 * direction, col: pos.col };
          if (isWithinBoard(forward2) && isEmpty(board, forward2)) {
            moves.push({ from: pos, to: forward2, piece });
          }
        }
      }

      // Captures
      const captures = [
        { row: pos.row + direction, col: pos.col - 1 },
        { row: pos.row + direction, col: pos.col + 1 },
      ];
      captures.forEach((target) => {
        if (isWithinBoard(target)) {
          const targetPiece = getPieceAt(board, target);
          if (targetPiece && targetPiece.color !== color) {
            moves.push({ from: pos, to: target, piece, captured: targetPiece });
          } else if (state.enPassantTarget && state.enPassantTarget.row === target.row && state.enPassantTarget.col === target.col) {
            const capturedPawn = getPieceAt(board, { row: pos.row, col: target.col });
            moves.push({ from: pos, to: target, piece, captured: capturedPawn || undefined, isEnPassant: true });
          }
        }
      });
      break;

    case 'rook':
      const rookDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      rookDirs.forEach(([dr, dc]) => {
        let r = pos.row + dr;
        let c = pos.col + dc;
        while (isWithinBoard({ row: r, col: c })) {
          const target = { row: r, col: c };
          const p = getPieceAt(board, target);
          if (!p) {
            moves.push({ from: pos, to: target, piece });
          } else {
            if (p.color !== color) {
              moves.push({ from: pos, to: target, piece, captured: p });
            }
            break;
          }
          r += dr;
          c += dc;
        }
      });
      break;

    case 'knight':
      const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      knightMoves.forEach(([dr, dc]) => {
        const target = { row: pos.row + dr, col: pos.col + dc };
        if (isWithinBoard(target)) {
          const p = getPieceAt(board, target);
          if (!p || p.color !== color) {
            moves.push({ from: pos, to: target, piece, captured: p || undefined });
          }
        }
      });
      break;

    case 'bishop':
      const bishopDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      bishopDirs.forEach(([dr, dc]) => {
        let r = pos.row + dr;
        let c = pos.col + dc;
        while (isWithinBoard({ row: r, col: c })) {
          const target = { row: r, col: c };
          const p = getPieceAt(board, target);
          if (!p) {
            moves.push({ from: pos, to: target, piece });
          } else {
            if (p.color !== color) {
              moves.push({ from: pos, to: target, piece, captured: p });
            }
            break;
          }
          r += dr;
          c += dc;
        }
      });
      break;

    case 'queen':
      const queenDirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      queenDirs.forEach(([dr, dc]) => {
        let r = pos.row + dr;
        let c = pos.col + dc;
        while (isWithinBoard({ row: r, col: c })) {
          const target = { row: r, col: c };
          const p = getPieceAt(board, target);
          if (!p) {
            moves.push({ from: pos, to: target, piece });
          } else {
            if (p.color !== color) {
              moves.push({ from: pos, to: target, piece, captured: p });
            }
            break;
          }
          r += dr;
          c += dc;
        }
      });
      break;

    case 'king':
      const kingMoves = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      kingMoves.forEach(([dr, dc]) => {
        const target = { row: pos.row + dr, col: pos.col + dc };
        if (isWithinBoard(target)) {
          const p = getPieceAt(board, target);
          if (!p || p.color !== color) {
            moves.push({ from: pos, to: target, piece, captured: p || undefined });
          }
        }
      });

      // Castling
      if (canCastleKingSide(board, color, state)) {
        moves.push({ from: pos, to: { row: pos.row, col: 6 }, piece, isCastling: true });
      }
      if (canCastleQueenSide(board, color, state)) {
        moves.push({ from: pos, to: { row: pos.row, col: 2 }, piece, isCastling: true });
      }
      break;
  }

  return moves;
};

/**
 * Checks if a color's king is in check.
 */
export const isCheck = (board: Board, color: PlayerColor): boolean => {
  let kingPos: Position | null = null;
  // Find king
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.type === 'king' && p.color === color) {
        kingPos = { row: r, col: c };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  // Check if any enemy piece can capture the king
  const enemyColor = color === 'white' ? 'black' : 'white';
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.color === enemyColor) {
        // We use a simplified pseudo-legal move check here to avoid infinite recursion
        // A piece threatens the king if it can move to the king's square according to its movement rules
        if (canPieceReach(board, { row: r, col: c }, kingPos)) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Simplified check to see if a piece at 'from' can theoretically capture 'to'.
 * This is used by isCheck to avoid recursion issues with full pseudo-legal move generation.
 */
const canPieceReach = (board: Board, from: Position, to: Position): boolean => {
  const piece = board[from.row][from.col];
  if (!piece) return false;

  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      return dr === direction && absDc === 1;
    case 'rook':
      if (dr !== 0 && dc !== 0) return false;
      const stepR = dr === 0 ? 0 : dr / absDr;
      const stepC = dc === 0 ? 0 : dc / absDc;
      let r = from.row + stepR;
      let c = from.col + stepC;
      while (r !== to.row || c !== to.col) {
        if (!isEmpty(board, { row: r, col: c })) return false;
        r += stepR;
        c += stepC;
      }
      return true;
    case 'knight':
      return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);
    case 'bishop':
      if (absDr !== absDc) return false;
      const sR = dr / absDr;
      const sC = dc / absDc;
      let currR = from.row + sR;
      let currC = from.col + sC;
      while (currR !== to.row || currC !== to.col) {
        if (!isEmpty(board, { row: currR, col: currC })) return false;
        currR += sR;
        currC += sC;
      }
      return true;
    case 'queen':
      if (dr !== 0 && dc !== 0 && absDr !== absDc) return false;
      const stR = dr === 0 ? 0 : dr / absDr;
      const stC = dc === 0 ? 0 : dc / absDc;
      let cR = from.row + stR;
      let cC = from.col + stC;
      while (cR !== to.row || cC !== to.col) {
        if (!isEmpty(board, { row: cR, col: cC })) return false;
        cR += stR;
        cC += stC;
      }
      return true;
    case 'king':
      return absDr <= 1 && absDc <= 1;
  }
  return false;
};

/**
 * Checks if a move is legal (pseudo-legal AND doesn't leave king in check).
 */
export const isLegalMove = (board: Board, move: Move, state: GameState): boolean => {
  const newBoard = simulateMove(board, move);
  return !isCheck(newBoard, move.piece.color);
};

/**
 * Simulates a move on a virtual board.
 */
export const simulateMove = (board: Board, move: Move): Board => {
  const newBoard = board.map(row => [...row]);
  const { from, to, isCastling, isEnPassant } = move;

  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;

  if (isEnPassant) {
    const direction = move.piece.color === 'white' ? 1 : -1;
    newBoard[to.row + direction][to.col] = null;
  }

  if (isCastling) {
    if (to.col === 6) { // King side
      newBoard[from.row][5] = newBoard[from.row][7];
      newBoard[from.row][7] = null;
    } else if (to.col === 2) { // Queen side
      newBoard[from.row][3] = newBoard[from.row][0];
      newBoard[from.row][0] = null;
    }
  }

  return newBoard;
};

/**
 * Gets all legal moves for a player.
 */
export const getAllLegalMoves = (board: Board, color: PlayerColor, state: GameState): Move[] => {
  const moves: Move[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const pseudoMoves = getPseudoLegalMoves(board, { row: r, col: c }, state);
        pseudoMoves.forEach((m) => {
          if (isLegalMove(board, m, state)) {
            moves.push(m);
          }
        });
      }
    }
  }
  return moves;
};

/**
 * Checkmate detection.
 */
export const isCheckmate = (board: Board, color: PlayerColor, state: GameState): boolean => {
  if (!isCheck(board, color)) return false;
  const legalMoves = getAllLegalMoves(board, color, state);
  return legalMoves.length === 0;
};

/**
 * Stalemate detection.
 */
export const isStalemate = (board: Board, color: PlayerColor, state: GameState): boolean => {
  if (isCheck(board, color)) return false;
  const legalMoves = getAllLegalMoves(board, color, state);
  return legalMoves.length === 0;
};

// --- Castling Helpers ---

const canCastleKingSide = (board: Board, color: PlayerColor, state: GameState): boolean => {
  const rights = state.castlingRights[color];
  if (!rights.kingSide) return false;

  const row = color === 'white' ? 7 : 0;
  if (!isEmpty(board, { row, col: 5 }) || !isEmpty(board, { row, col: 6 })) return false;

  if (isCheck(board, color)) return false;

  // King cannot pass through check
  const boardAfterF1 = simulateMove(board, { from: { row, col: 4 }, to: { row, col: 5 }, piece: board[row][4]! });
  if (isCheck(boardAfterF1, color)) return false;

  return true;
};

const canCastleQueenSide = (board: Board, color: PlayerColor, state: GameState): boolean => {
  const rights = state.castlingRights[color];
  if (!rights.queenSide) return false;

  const row = color === 'white' ? 7 : 0;
  if (!isEmpty(board, { row, col: 1 }) || !isEmpty(board, { row, col: 2 }) || !isEmpty(board, { row, col: 3 })) return false;

  if (isCheck(board, color)) return false;

  // King cannot pass through check
  const boardAfterD1 = simulateMove(board, { from: { row, col: 4 }, to: { row, col: 3 }, piece: board[row][4]! });
  if (isCheck(boardAfterD1, color)) return false;

  return true;
};

/**
 * Basic Computer Move (Random Legal Move).
 */
export const getBasicComputerMove = (board: Board, color: PlayerColor, state: GameState): Move | null => {
  const moves = getAllLegalMoves(board, color, state);
  if (moves.length === 0) return null;
  
  // Slightly smarter: prioritize captures
  const captureMoves = moves.filter(m => m.captured !== undefined);
  if (captureMoves.length > 0) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }

  return moves[Math.floor(Math.random() * moves.length)];
};
