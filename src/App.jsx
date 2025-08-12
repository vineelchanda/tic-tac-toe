import React, { useMemo } from 'react';
import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import './app.css';

function generateGameIdFromURL() {
  const url = new URL(window.location.href);
  let g = url.searchParams.get('game');
  if (!g) {
    g = crypto.randomUUID().slice(0, 8);
    url.searchParams.set('game', g);
    window.history.replaceState({}, '', url.toString());
  }
  return g;
}

export default function App() {
  const gameId = useMemo(() => generateGameIdFromURL(), []);
  const {
    game,
    loading,
    playerRole,
    join,
    reset,
    makeMove
  } = useGame(gameId);

  if (loading || !game) {
    return <div className="container"><h2>Loading game...</h2></div>;
  }

  const canMove = game.status === 'in_progress' && playerRole === game.turn && !game.winner;

  let statusMsg = '';
  if (game.status === 'waiting') {
    statusMsg = 'Waiting for players to join.';
  } else if (game.status === 'in_progress') {
    statusMsg = (playerRole === game.turn)
      ? `Your turn (${playerRole})`
      : `Opponent's turn (${game.turn})`;
  } else if (game.status === 'finished') {
    statusMsg = game.winner === 'draw'
      ? 'Draw! Reset to play again.'
      : `Winner: ${game.winner}`;
  } else if (game.status === 'abandoned') {
    statusMsg = 'A player left. Waiting for someone to rejoin.';
  }

  return (
    <div className="container">
      <h1>React + Firestore Tic-Tac-Toe</h1>
      <div className="meta">
        <div><strong>Game ID:</strong> {gameId}</div>
        <div><strong>Your Role:</strong> {playerRole || '—'}</div>
        <div><strong>Turn:</strong> {game.turn}</div>
        <div><strong>Winner:</strong> {game.winner || '—'}</div>
        <div className="status">{statusMsg}</div>
      </div>

      <div className="join">
        <button
          disabled={!!game.players.X}
          onClick={() => join('X')}
        >Join as X</button>
        <button
          disabled={!!game.players.O}
          onClick={() => join('O')}
        >Join as O</button>
      </div>

      <Board
        board={game.board}
        disabled={!canMove}
        onMove={makeMove}
      />

      <div className="controls">
        <button onClick={reset}>Reset Game</button>
        <Share />
      </div>

      <footer>
        <small>State synced via Firestore. Demo only – add auth & stricter rules for production.</small>
      </footer>
    </div>
  );
}

function Share() {
  const url = window.location.href;
  return (
    <div className="share">
      <label>Shareable URL</label>
      <div className="share-row">
        <input value={url} readOnly />
        <button onClick={() => {
          navigator.clipboard.writeText(url);
        }}>Copy</button>
      </div>
    </div>
  );
}