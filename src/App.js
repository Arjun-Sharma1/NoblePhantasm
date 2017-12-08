import React, { Component } from 'react';
import {recievedMessages } from './api';
//import logo from './logo.svg';
//import './App.css';

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

  createGame(event) {
    if(this.state.name !== ''){
      console.log(this.state.name);
      //newGame("newGame",this.state.name);
    }
    event.preventDefault();
  }

  joinGame(event) {
    if(this.state.gameCode !== ''){
      newGame("joinGame", this.state.gameCode);
    }
    event.preventDefault();
  }

  startGame(event) {
    if(this.state.name !== ''){
      console.log(this.state.name);
      //newGame("newGame",this.state.name);
    }
    event.preventDefault();
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
