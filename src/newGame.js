import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';
import { newGame, recievedMessages } from './api';
import {joinGameID} from './joinGame.js';


export class newGameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {gameCode: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    recievedMessages();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.gameCode !== ''){
      newGame("newGame", this.state.gameCode);
      this.props.history.push('/joinGame/'+this.state.gameCode);
      // if(test){
      //   this.props.history.push('/joinGame/'+this.state.gameCode);
      // }else{
      //   console.log("Error Creating Game " + this.state.gameCode);
      // }
    }else{
      console.log("error no gameCode Entered");
    }
    //Stop from refreshing the page
    event.preventDefault();
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <form id="form5" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <p>Enter num</p>
            <input id="jg" name='gameCode' value={this.state.gameCode}/><button>Create Game</button>
        </form>
        <Switch>
          <Route path='/joinGame/:number' component={joinGameID}/>
        </Switch>
      </div>
    );
  }

}
