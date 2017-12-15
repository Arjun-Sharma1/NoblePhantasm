import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';
import { sendJoinGameRequest,sendLeaveLobbyRequest, sendStartGameRequest, socket, checkValidLobby } from './api';
var HashMap = require('hashmap');
var localUser = "";
var rolesRegistry;

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
    localUser = '';
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
          localUser = this.state.username;
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
        <Switch>
          <Route path='/joinGame/:number' component={joinGameID}/>
        </Switch>
      </div>
    );
  }
}


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export class joinGameID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: props.match.params,
      users: [],
      errorMessage: '',
      vigilante:false,
      doctor:false,
      jester:false,
      detective:false,
      assassin:''
    };
    this.startGame = this.startGame.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.addUsers = this.addUsers.bind(this);
    this.decidePage = this.decidePage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    checkValidLobby(this.state.lobbyId.number);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  addUsers(username) {
    let holder = [];
    username.map(function(user) {
      if (!holder.includes(user) && holder.user !== '') {
        holder.push(user);
      }
      return true;
    })
    //Check if component is fully mounted before setting state
    if (this.refs.joinGame) {
      this.setState({
        users: holder
      });
    }
  }

  startGame() {
    console.log(this.state.users.length);
    if (this.state.users.length >= 2) {
      sendStartGameRequest(this.state.lobbyId.number);
    } else {
      this.setState({
        errorMessage: "Must have a minimum of 5 Players to Start"
      })
    }
  }

  leaveLobby() {
    console.log(this.state.lobbyId.number);
    sendLeaveLobbyRequest(this.state.lobbyId.number);
    localUser = '';
    socket.on('leaveLobby', function(msg) {
      this.props.history.push('/');
    }.bind(this));
  }

  decidePage(assignedRoles) {
    rolesRegistry = assignedRoles;
    if (assignedRoles.get(localUser) !== "moderator") {
      this.props.history.push('/game');
    } else {
      this.props.history.push('/moderator');
    }
  }

  handleInputChange(event) {
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}

  render() {
      socket.on(this.state.lobbyId.number, function(msg) {
        if (msg.userId !== undefined && !this.state.users.includes(msg.userId) && localUser !== '') {
          this.addUsers(msg.userId);
        }
      }.bind(this));

      socket.on('startGameConf', function(msg) {
        var assignedRoles = new HashMap(msg);
        this.decidePage(assignedRoles);
      }.bind(this));

      socket.on('errorMessage', function(msg) {
        this.setState({
          errorMessage: msg.errorMessage
        });
      }.bind(this));

      socket.on('checkLobby', function(msg) {
        console.log(msg);
        if (!localUser || msg.valid === 'false') {
          this.props.history.push('/');
        }
      }.bind(this));

    return (
      <div ref="joinGame" className="App">
        <header className="App-header">
          <h1 className="App-title">Waiting for Players...</h1>
          <h2>Lobby Code: {this.state.lobbyId.number}</h2>
          <h3>Current People in Lobby </h3>
        </header>
        <ul>
        {this.state.users.map(function(listValue,index) {
          return <li key={index}><a href="#">{listValue}</a></li>;
        })}
        </ul>
        <h3>Role Picker</h3>
        <form id="form5" onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <label>
          Vigilante:
          <input
            name="vigilante"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Doctor:
          <input
            name="doctor"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Detective:
          <input
            name="detective"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Jester:
          <input
            name="jester"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <input className='textBox' id="assassin" name='assassin' value={this.state.assassin} placeholder="Enter Number of Assassin(s)"/>

        </form>
        <button className='buttonPlay' onClick={this.startGame}>Start Game</button>
        <button className='buttonLeave' onClick={this.leaveLobby}>Leave Game</button>
        <div className='errorMessage'>{this.state.errorMessage}</div>
        <div>
        </div>
      </div>
    );
  }
}

function setLocalUser(username) {
  localUser = username;
};
export {setLocalUser, rolesRegistry, localUser};
