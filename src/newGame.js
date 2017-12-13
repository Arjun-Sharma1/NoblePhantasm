import React, { Component } from 'react';
import { sendNewGameRequest, socket } from './api';
import {setLocalUser} from './joinGame.js';


export class newGameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {username: '',errorMessage:''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
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
      this.setState({errorMessage: "Error no username entered"});
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
            <input className='textBox' id="name" name='username' value={this.state.username} placeholder="Enter your name"/>
            <br/>
            <button type="submit" className='buttonPlay'>Create</button>
            <button type="button" className='buttonLeave' onClick={this.goToLanding}>
              Back
            </button>
        </form>
        <div className='errorMessage'>{this.state.errorMessage}</div>
      </div>
    );
  }

}
