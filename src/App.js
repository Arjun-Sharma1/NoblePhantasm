import React, { Component } from 'react';
import {recievedMessages } from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {name: '', gameCode: '', message: ''};

    this.goToNewGame = this.goToNewGame.bind(this);
    this.goToJoinGame = this.goToJoinGame.bind(this);

    recievedMessages();
  }

  goToNewGame() {
    this.props.history.push('/newGame');
  }

  goToJoinGame() {
    this.props.history.push('/joinGame');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Noble Phantasm</h1>
        </header>
        <button onClick={this.goToNewGame}>
          New Game
        </button>
        <button onClick={this.goToJoinGame}>
          Join Game
        </button>
      </div>
    );
  }
}

export default App;
