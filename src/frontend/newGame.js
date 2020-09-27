import React, { Component } from 'react';
import { sendNewGameRequest, socket } from './api';

export default class NewGameCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      errorMessage: '',
      lobbyId:''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    if (this.state.username !== '') {
      sendNewGameRequest(this.state.username);
      let path = this.props.history;
      socket.on('ngConf', function(msg) {
        if (msg.lobbyId !== '') {
          this.props.setUsername(this.state.username);
          this.setState({lobbyId:msg.lobbyId})
        }
      }.bind(this));
    } else {
      this.setState({
        errorMessage: "Error no username entered"
      });
      console.log("error no username entered");
    }
    //Stop from refreshing the page
    event.preventDefault();
  }

  goToLanding() {
    this.props.history.push('/');
  }

  render() {

    if(this.props.username && this.state.lobbyId){
      let path = this.props.history;
      path.push('/joinGame/' + this.state.lobbyId);
    }

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
