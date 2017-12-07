import React, { Component } from 'react';
import { sendNewGameRequest, recievedMessages, socket } from './api';
import {setLocalUser} from './joinGame.js';


export class newGameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {username: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    recievedMessages();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.username !== ''){
      sendNewGameRequest(this.state.username);
      let path = this.props.history;
      socket.on('ngConf',function(msg){
          if(msg.lobbyId !== ''){
            setLocalUser(this.state.username);
            path.push('/joinGame/'+msg.lobbyId);
          }
      }.bind(this));
    }else{
      console.log("error no username entered");
    }
    //Stop from refreshing the page
    event.preventDefault();
  }

  goToLanding() {
    this.props.history.push('/');
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Noble Phantasm</h1>
        </header>
        <form id="form5" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <p>Enter name:</p>
            <input id="name" name='username' value={this.state.username} placeholder="Enter name"/>
            <button>Create Game</button>
        </form>
        <button onClick={this.goToLanding}>
          Back
        </button>
      </div>
    );
  }

}
