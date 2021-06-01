import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareValue = 'X' | 'O' | null;

type SquareProps = {
  value: SquareValue;
  onClick: () => void;
};

type BoardProps = {
  squares: SquareValue[];
  onClick: (i: number) => void;
};

type History = {
  squares: SquareValue[];
  col?: number;
  row?: number;
};

const calculateWinner = (squares: SquareValue[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

const Square: React.VFC<SquareProps> = ({ value, onClick }) => (
  <button className="square" type="button" onClick={onClick}>
    {value}
  </button>
);

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => (
    <Square value={props.squares[i]} onClick={() => props.onClick(i)} />
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState<History[]>([
    {
      squares: Array<SquareValue>(9).fill(null),
      col: 0,
      row: 0,
    },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number) => {
    const historyArray = history.slice(0, stepNumber + 1);
    const current = historyArray[historyArray.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(
      historyArray.concat([
        { squares, col: (i % 3) + 1, row: Math.floor(i / 3) + 1 },
      ]),
    );
    setStepNumber(historyArray.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const historyArray = history;
  const current = historyArray[stepNumber];
  const winner = calculateWinner(current.squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (${String(step.col)}, ${String(step.row)})`
      : 'Go to game start';

    return (
      <li key={move.toString()}>
        <button type="button" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
