import { useCallback, useState } from 'react';
import { PlayerColor } from '../utils/ludoConstants';

export interface TokenState {
  id: number;
  pos: number; // -1: base, 0-51: board, 52-57: home path, 58: finished
  color: PlayerColor;
}

export const useLudoGame = () => {
  const [tokens, setTokens] = useState<Record<PlayerColor, TokenState[]>>({
    red: [0, 1, 2, 3].map(id => ({ id, pos: -1, color: 'red' })),
    green: [0, 1, 2, 3].map(id => ({ id, pos: -1, color: 'green' })),
    yellow: [0, 1, 2, 3].map(id => ({ id, pos: -1, color: 'yellow' })),
    blue: [0, 1, 2, 3].map(id => ({ id, pos: -1, color: 'blue' })),
  });

  const [turn, setTurn] = useState<PlayerColor>('red');
  const [dice, setDice] = useState<number>(1);
  const [rolling, setRolling] = useState(false);
  const [canMove, setCanMove] = useState(false);
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  const nextTurn = useCallback(() => {
    const sequence: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
    const idx = sequence.indexOf(turn);
    setTurn(sequence[(idx + 1) % 4]);
    setCanMove(false);
  }, [turn]);

  const rollDice = useCallback(() => {
    if (rolling || canMove) return;
    setRolling(true);
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setDice(val);
      setRolling(false);

      // Check if player can actually move
      const currentPlayerTokens = tokens[turn];
      const hasMoves = currentPlayerTokens.some(t => {
        if (t.pos === -1) return val === 6;
        if (t.pos === 58) return false;
        return t.pos + val <= 58;
      });

      if (hasMoves) {
        setCanMove(true);
      } else {
        setTimeout(nextTurn, 1000);
      }
    }, 600);
  }, [rolling, canMove, tokens, turn, nextTurn]);

  const moveToken = useCallback((color: PlayerColor, tokenId: number) => {
    if (color !== turn || !canMove) return;

    const token = tokens[color][tokenId];
    let newPos = token.pos;

    if (token.pos === -1) {
      if (dice === 6) newPos = 0; // Move to start
      else return;
    } else {
      newPos += dice;
      if (newPos > 58) return; // Cant overshoot home
    }

    // Update tokens
    // Update tokens with relative-to-global mapping
    const newTokens = { ...tokens };
    newTokens[color] = tokens[color].map(t =>
      t.id === tokenId ? { ...t, pos: newPos } : t
    );

    setTokens(newTokens);
    setCanMove(false);

    // Double turn if 6
    if (dice !== 6) {
      nextTurn();
    }

    // Check win condition
    if (newTokens[color].every(t => t.pos === 58)) {
      setWinner(color);
    }
  }, [turn, canMove, dice, tokens, nextTurn]);

  return {
    tokens,
    turn,
    dice,
    rolling,
    canMove,
    winner,
    rollDice,
    moveToken
  };
};
