import React, { Component } from 'react';
import { sendJoinGameRequest, socket } from './api';
import { setLocalUser} from './joinGameID'


export class joinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: '',
      username: '',
      errorMessage: ''
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
    if (!this.state.username) {
      this.setState({
        errorMessage: "Error username is empty"
      });
    } else if (!this.state.lobbyId) {
      this.setState({
        errorMessage: "Error lobby Id is empty"
      });
    } else {
      sendJoinGameRequest(this.state.username, this.state.lobbyId);
    }
    //Stop from refreshing the page
    event.preventDefault();
  }

  goToLanding() {
    setLocalUser('');
    this.props.history.push('/');
  }

  render() {
      socket.on('errorMessage', function(msg) {
        console.log(msg);
        this.setState({
          errorMessage: msg.errorMessage
        });
      }.bind(this));

      let path = this.props.history;
      socket.on('ngConf', function(msg) {
        if (msg.lobbyId !== '') {
          setLocalUser(this.state.username);
          path.push('/joinGame/' + msg.lobbyId);
        }
      }.bind(this));

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Noble Phantasm</h1>
        </header>
        <form id="form4" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <input className='textBox' id="username" name='username' value={this.state.username} placeholder="Enter your name"/>
            <br></br>
            <input className='textBox' id="lobbyId" name='lobbyId' value={this.state.lobbyId} placeholder="Enter the Lobby Id"/>
            <br></br>
        </form>
        <button className='buttonPlay' onClick={this.handleSubmit}>Join Game</button>
        <button className='buttonLeave' onClick={this.goToLanding}>
          Back
        </button>
        <div className='errorMessage'>{this.state.errorMessage}</div>
      </div>
    );
  }
}
