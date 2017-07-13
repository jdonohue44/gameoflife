import React, { Component } from 'react';
import { Button, Grid, Row, Col} from 'react-bootstrap';
import ReactAnimationFrame from 'react-animation-frame';
import './App.css';

class App extends Component {
  render() {
    return (
      <Grid>
        <Row style={{marginTop: '30px'}}>
          <Col mdOffset={1}>
            <Game running={false} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Rules />
          </Col>
        </Row>
      </Grid>
    );
  }
}

class Rules extends Component {
  render () {
    return (
      <div>
        <h2>Rules</h2>
        <p>The universe of the Game of Life is an infinite two-dimensional orthogonal
           grid of square cells, each of which is in one of two possible states, alive
           or dead, or "populated" or "unpopulated". Every cell interacts with its eight
           neighbours, which are the cells that are horizontally, vertically, or
           diagonally adjacent. At each step in time, the following transitions occur:
        </p>
        <ol>
          <li>Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ol>
        <p>The initial pattern constitutes the seed of the system. The first generation
          is created by applying the above rules simultaneously to every cell in the
          seed—births and deaths occur simultaneously, and the discrete moment at which
          this happens is sometimes called a tick (in other words, each generation is a
          pure function of the preceding one). The rules continue to be applied
          repeatedly to create further generations.
        </p>
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: props.running,
      cols: 80,
      rows: 50,
      cells: null
    };
  }

  componentWillMount() {
    this.createBoardArray();
  }

  componentDidMount() {
    this.setInitialState();
  }

  createBoardArray() {
    this.setState({cells: [...Array(this.state.rows).keys()].map(i => Array(this.state.cols).fill(0))});
  }

  setInitialState() {
    this.state.cells[40][14] = 1;
    this.state.cells[40][15] = 1;
    this.state.cells[40][16] = 1;
    this.state.cells[39][16] = 1;
    this.state.cells[37][15] = 1;
    this.forceUpdate();
  }

  handleStartClick() {
    // this.setState({running: true}, () => this.update());
    this.setState({running: true});
    this.update();
  }

  handleResetClick() {
    this.setState({running: false});
    this.clearBoard();
  }

  clearBoard() {
    var newState = [...Array(this.state.rows).keys()].map(i => Array(this.state.cols).fill(0))
    this.setState({cells: newState});
  }

  checkState(cells, row, col){
    //returns true if the state should switch state
    var lastRow = this.state.rows - 1;
    var lastCol = this.state.cols - 1;

    var rStart = Math.max(row-1, 0);
    var cStart = Math.max(col-1, 0);
    var rEnd   = Math.min(row+1, lastRow);
    var cEnd   = Math.min(col+1, lastCol);

    var sum = 0;
    var currentState = cells[row][col];

    for(var r=rStart; r<=rEnd; r++){
      for(var c=cStart; c<=cEnd; c++){
        sum += cells[r][c];
      }
    }

    sum -= cells[row][col];
    var change = false;
    if (currentState == 1) {
      if (sum == 2 || sum == 3){
        change = false;
      } else {
        change = true;
      }
    } else {
      if (sum == 3) {
        change = true;
      } else {
        change = false;
      }
    }

    return change;
  }

  update() {
    // loop over board and update state
    console.log(this);

    var rows = this.state.rows;
    var cols = this.state.cols;
    var cells = this.state.cells;
    var newState = [...Array(this.state.rows).keys()].map(i => Array(this.state.cols).fill(0))

    for (var r=0; r < rows; r++){
      for (var c=0; c < cols; c++){
        if(this.checkState(cells, r, c)){
          newState[r][c] = cells[r][c] ? 0 : 1;
        } else {
          newState[r][c] = cells[r][c];
        }
      }
    }

    this.setState({cells: newState});
    this.forceUpdate();

    // wait
    var now = new Date().getTime();
    var stop = now + 2000;
    while (now < stop) {
      now = new Date().getTime();
    }

    // requestAnimationFrame
      requestAnimationFrame(this.update());
  }

  render () {
    return (
      <div>
      <Board cells={this.state.cells} style={{display: 'inline-block'}}/>
      <Row style={{marginTop: '15px'}}>
        <Col xs={4} mdOffset={2}>
          <Button
            bsStyle="primary"
            onClick={() => this.handleStartClick()}
            disabled={this.state.running}
            block={true}>Start
          </Button>
        </Col>
        <Col xs={2} mdOffset={0}>
          <Button
            bsStyle="danger"
            onClick={() => this.handleResetClick()}
            block={true}>Reset
          </Button>
        </Col>
      </Row>
      </div>
    );
  }
}

class Board extends Component {
  isCellAlive(x,y) {
    return this.props.cells[x][y] === 1;
  }

  render () {
    const cells = this.props.cells;
    return (
      <Grid>
        {
          cells.map((rows, rowIndex) =>
            <Row key={rowIndex}>
              {rows.map((cell, cellIndex) => <Col key={cellIndex}><Cell isAlive={this.isCellAlive(rowIndex,cellIndex)} /></Col>)}
            </Row>)
        }
      </Grid>
    );
  }
}

class Cell extends Component {
  render () {
    const alive = this.props.isAlive;
    return (
      alive ? <button className="cell alive" disabled></button>
        : <button className="cell dead" disabled></button>
    );
  }
}

export default App;
