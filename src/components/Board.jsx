import React from 'react';
import './Board.css';

export function Board({ board, disabled, onMove }) {
  return (
    <div className="board">
      {board.map((v, i) => (
        <div
          key={i}
          className={`cell ${disabled || v ? 'disabled' : ''}`}
          onClick={() => {
            if (!disabled && v === '') onMove(i);
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}