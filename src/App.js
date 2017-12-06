import React, { Component } from 'react';
import { newGame, recievedMessages } from './api';
//import logo from './logo.svg';
//import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {name: '', gameCode: '', message: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    recievedMessages();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    var dataToSend = '';
    if(this.state.name !== ''){
      newGame("newGame",this.state.name);
    }else if(this.state.gameCode !== ''){
      newGame("joinGame", this.state.gameCode);
    }else{
      console.log('error');
    }
    //Stop from refreshing the page
    event.preventDefault();
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
          <h1 className="App-title">Noble Phantasm</h1>
        </header>
        <ul id="messages"></ul>
        <form id="form1" onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <input id="m" name='message' value={this.state.message}/><button>Send</button>
        </form>
        <form id="form2" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <p>Enter Name</p>
            <input id="ng" name='name' value={this.state.name}/><button>New Game</button>
        </form>
        <br/>
        <form id="form3" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <p>Enter num</p>
            <input id="jg" name='gameCode' value={this.state.gameCode}/><button>Join Game</button>
        </form>
        <form id="form4" onSubmit={this.startGame} onChange={this.handleChange}>
            <p>Enter start</p>
            <input id="xyz" name='xyz1'/><button>Start Game</button>
        </form>

        {/* <input id="nameInput" 
        placeholder="Name" name='name' 
        value={this.state.name} 
        onChangeText={(name) => this.setState({name})}
        onChange={this.handleChange}/>
        <br/>
        <input id="gameInput" 
        placeholder="Game Code" 
        name='gameCode'
        value={this.state.gameCode} 
        onChange={onChange={event => this.updateInputValue(evt)}}/>
        <br/>
        <button id='ngBtn' name='ngBtn' onClick={this.createGame}>New Game</button>
        <br/>
        <button id='jgBtn' name='jgBtn' onClick={this.joinGame}>Join Game</button> */}

      </div>
    );
  }
}

export default App;
