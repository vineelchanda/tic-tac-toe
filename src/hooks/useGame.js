import { useCallback, useEffect, useRef, useState } from 'react';
import {
  db,
  doc,
  getDoc,
  setDoc,
  runTransaction,
  onSnapshot,
  ts
} from '../firebase';

const INITIAL = () => ({
  players: { X: null, O: null },
  board: Array(9).fill(''),
  turn: 'X',
  winner: '',
  status: 'waiting',
  createdAt: ts(),
  lastMoveAt: null
});

export function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef(null);

  const gameRef = doc(db, 'games', gameId);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snap = await getDoc(gameRef);
      if (!snap.exists()) {
        await setDoc(gameRef, INITIAL());
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [gameId]);

  useEffect(() => {
    unsubRef.current = onSnapshot(gameRef, (snap) => {
      setGame(snap.data());
    });
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [gameId]);

  const join = useCallback(async (role) => {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(gameRef);
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.players[role]) return;
      const newPlayers = { ...data.players, [role]: randomId() };
      let status = data.status;
      if (newPlayers.X && newPlayers.O && status !== 'finished') {
        status = 'in_progress';
      }
      transaction.update(gameRef, { players: newPlayers, status });
      if (!playerRole) {
        setPlayerRole(role);
      }
    });
  }, [gameRef, playerRole]);

  const reset = useCallback(async () => {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(gameRef);
      if (!snap.exists()) return;
      const data = snap.data();
      transaction.update(gameRef, {
        board: Array(9).fill(''),
        turn: 'X',
        winner: '',
        status: (data.players.X && data.players.O) ? 'in_progress' : 'waiting',
        lastMoveAt: null
      });
    });
  }, [gameRef]);

  const makeMove = useCallback(async (index) => {
    if (!playerRole) return;
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(gameRef);
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.status !== 'in_progress') return;
      if (data.turn !== playerRole) return;
      if (data.board[index] !== '') return;

      const board = [...data.board];
      board[index] = playerRole;
      let winner = detectWinner(board);
      let status = data.status;
      let turn = data.turn;
      if (winner) {
        status = 'finished';
      } else if (board.every(c => c !== '')) {
        winner = 'draw';
        status = 'finished';
      } else {
        turn = (data.turn === 'X') ? 'O' : 'X';
      }

      transaction.update(gameRef, {
        board,
        turn,
        winner,
        status,
        lastMoveAt: ts()
      });
    });
  }, [gameRef, playerRole]);

  useEffect(() => {
    const handler = () => {
      if (!playerRole) return;
      navigator.sendBeacon?.(`/leave?game=${gameId}&role=${playerRole}`);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [playerRole, gameId]);

  return {
    game,
    loading,
    playerRole,
    join,
    reset,
    makeMove
  };
}

function randomId() {
  return crypto.randomUUID().slice(0, 6);
}

function detectWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}