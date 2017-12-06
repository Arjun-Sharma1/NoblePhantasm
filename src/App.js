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
      this.props.history.push('/newGame');
    }else if(this.state.gameCode !== ''){
      this.props.history.push('/joinGame');
    }else if(this.state.message !== ''){
      newGame("test",this.state.message);
    }else{
      console.log("error");
    }
    //Stop from refreshing the page
    event.preventDefault();
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Noble Phantasm</h1>
        </header>
        <ul id="messages"></ul>
        <form id="form1" onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <input id="m" name='message' value={this.state.message}/><button>Send</button>
        </form>
        <form id="form2" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <p>Enter Name</p>
            <input id="ng" name='name' value={this.state.name}/><button>New Game</button>
        </form>
        <form id="form3" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <p>Enter num</p>
            <input id="jg" name='gameCode' value={this.state.gameCode}/><button>Join Game</button>
        </form>
      </div>
    );
  }
}

export default App;
