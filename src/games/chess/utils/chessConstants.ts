export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PlayerColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  id: string; // To track piece movement (unique ID)
}

export type Square = Piece | null;
export type BoardSize = 8;
export type Board = Square[][];

export const BOARD_SIZE: BoardSize = 8;

export const INITIAL_BOARD_LAYOUT: Board = [
  [
    { type: 'rook', color: 'black', id: 'br1' },
    { type: 'knight', color: 'black', id: 'bn1' },
    { type: 'bishop', color: 'black', id: 'bb1' },
    { type: 'queen', color: 'black', id: 'bq' },
    { type: 'king', color: 'black', id: 'bk' },
    { type: 'bishop', color: 'black', id: 'bb2' },
    { type: 'knight', color: 'black', id: 'bn2' },
    { type: 'rook', color: 'black', id: 'br2' },
  ],
  Array(8).fill(null).map((_, i) => ({ type: 'pawn', color: 'black', id: `bp${i + 1}` })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map((_, i) => ({ type: 'pawn', color: 'white', id: `wp${i + 1}` })),
  [
    { type: 'rook', color: 'white', id: 'wr1' },
    { type: 'knight', color: 'white', id: 'wn1' },
    { type: 'bishop', color: 'white', id: 'wb1' },
    { type: 'queen', color: 'white', id: 'wq' },
    { type: 'king', color: 'white', id: 'wk' },
    { type: 'bishop', color: 'white', id: 'wb2' },
    { type: 'knight', color: 'white', id: 'wn2' },
    { type: 'rook', color: 'white', id: 'wr2' },
  ],
];

export const UNICODE_PIECES: Record<PlayerColor, Record<PieceType, string>> = {
  white: {
    pawn: '♙',
    rook: '♖',
    knight: '♘',
    bishop: '♗',
    queen: '♕',
    king: '♔',
  },
  black: {
    pawn: '♟',
    rook: '♜',
    knight: '♞',
    bishop: '♝',
    queen: '♛',
    king: '♚',
  },
};

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  isCastling?: boolean;
  isEnPassant?: boolean;
}

export interface GameState {
  board: Board;
  turn: PlayerColor;
  history: Move[];
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  castlingRights: {
    white: { kingSide: boolean; queenSide: boolean };
    black: { kingSide: boolean; queenSide: boolean };
  };
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  isGameOver: boolean;
  winner: PlayerColor | 'draw' | null;
  statusMessage: string;
}
