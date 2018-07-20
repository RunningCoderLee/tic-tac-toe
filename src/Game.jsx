import React from 'react';
import Board from './Board';

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: {
          col: null,
          row: null,
        }
      }],
      stepNumber: 0,
      xIsNext: true,
      order: 'ascending',
    };
  }

  handleClick(i) {
    let history;
    let current;
    let newHistory;
    if (this.state.order === 'ascending') {
      history = this.state.history.slice(0, this.state.stepNumber + 1);
      current = history[history.length - 1];
    } else {
      history = this.state.history.slice(this.state.stepNumber);
      current = history[0];
    }
    // const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // const current = history[history.length - 1];
    const squares = [...current.squares];
    

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const currentLocation = {
      col: (i % 3) + 1,
      row: Math.floor(i/3) + 1,
    }

    if (this.state.order === 'ascending') {
      newHistory = history.concat([{
        squares: squares,
        location: currentLocation
      }])
    } else {
      newHistory = [{
        squares: squares,
        location: currentLocation
      }].concat(history)
    }

    this.setState({
      history: newHistory,
      stepNumber: this.state.order === 'ascending' ? history.length : 0,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrder = () => {
    const { history } = this.state;
    const newHistory = [...history];

    newHistory.reverse();

    console.log(newHistory);
    this.setState((prevState) => {
      return {
        history: newHistory,
        order: prevState.order === 'ascending' ? 'descending' : 'ascending',
        stepNumber: (history.length - 1) - prevState.stepNumber,
      };
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc;
      if (this.state.order === 'ascending') {
        desc = move ?
        `Go to move #${move} (row: ${step.location.row}, col: ${step.location.col})`:
        'Go to game start';
      } else {
        desc = (move === (history.length - 1)) ? 'Go to game start'
        : `Go to move #${history.length - move} (row: ${step.location.row}, col: ${step.location.col})`;
      }

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
          >
            {this.state.stepNumber === move ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          /> 
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div><button onClick={this.changeOrder}>Change Order</button></div>
      </div>
    );
  }
}

export default Game;