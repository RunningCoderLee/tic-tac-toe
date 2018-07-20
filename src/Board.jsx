import React from 'react';
import Square from './Square';

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    const squareViews = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = i*3; j < i*3+3; j++) {
        row.push(this.renderSquare(j));
      }
      squareViews.push(<div className="board-row" key={i}>{row}</div>);
    }

    return (
      <div>
        {squareViews}
      </div>
    );
  }
}

export default Board;