import React, { Component } from 'react';
import { sendLeaveLobbyRequest, sendStartGameRequest, socket, checkValidLobby } from './api';
var HashMap = require('hashmap');
var localUser = "";
var assassinTag = "assassin";
var vigilanteTag = "vigilante";
var doctorTag = "doctor";
var detectiveTag = "detective";
var jesterTag = "jester";
var rolesRegistry;


export class joinGameID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: props.match.params,
      users: [],
      errorMessage: '',
      vigilante:0,
      doctor:0,
      jester:0,
      detective:0,
      assassin:0
    };

    this.startGame = this.startGame.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.addUsers = this.addUsers.bind(this);
    this.decidePage = this.decidePage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.decrementRoleCountHandler = this.decrementRoleCountHandler.bind(this);
    this.incrementRoleCountHandler = this.incrementRoleCountHandler.bind(this);
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
    if (this.state.users.length >= 2) {
      sendStartGameRequest(this.state.lobbyId.number);
    } else {
      this.setState({
        errorMessage: "Must have a minimum of 5 Players to Start"
      })
    }
  }

  leaveLobby() {
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

  decrementRoleCountHandler(event, roleType) {
    event.preventDefault();    
    switch (roleType) {
      case assassinTag:
        if(this.state.assassin !== 0){     
          this.state.assassin--;     
          this.setState({assassin: this.state.assassin});
        }
        break;
      case vigilanteTag:
        if(this.state.vigilante !== 0){
          this.state.vigilante--;
          this.setState({vigilante: this.state.vigilante});
        }
        break;
      case doctorTag:
        if(this.state.doctor !== 0){
          this.state.doctor--;
          this.setState({doctor: this.state.doctor});
        }
        break;
      case detectiveTag:
        if(this.state.detective !== 0){
          this.state.detective--;
          this.setState({detective: this.state.detective});
        }
        break;
      case jesterTag:
        if(this.state.jester !== 0){
          this.state.jester--;
          this.setState({jester: this.state.jester});
        }
        break;
    }
  }

  incrementRoleCountHandler(event, roleType) {
    event.preventDefault();
    switch (roleType) {
      case assassinTag:
        this.state.assassin++;
        this.setState({assassin: this.state.assassin});        
        break;
      case vigilanteTag:
        this.state.vigilante++;
        this.setState({vigilante: this.state.vigilante});
        break;
      case doctorTag:
        this.state.doctor++;
        this.setState({doctor: this.state.doctor});
        break;
      case detectiveTag:
        this.state.detective++;
        this.setState({detective: this.state.detective});
        break;
      case jesterTag:
        this.state.jester++;
        this.setState({jester: this.state.jester});
        break;
    }
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
        
        <form name="rolePicker">
          <h4>Assassin</h4>
          <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,assassinTag)}>-</button>
          <input value={this.state.assassin} readOnly="true"/>
          <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,assassinTag)}>+</button>
        
          <h4>Vigilante</h4>
          <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,vigilanteTag)}>-</button>
          <input value={this.state.vigilante} readOnly="true"/>
          <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,vigilanteTag)}>+</button>
        
          <h4>Doctor</h4>
          <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,doctorTag)}>-</button>
          <input value={this.state.doctor} readOnly="true"/>
          <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,doctorTag)}>+</button>
        
          <h4>Detective</h4>
          <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,detectiveTag)}>-</button>
          <input value={this.state.detective} readOnly="true"/>
          <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,detectiveTag)}>+</button>
        
          <h4>Jester</h4>
          <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,jesterTag)}>-</button>
          <input value={this.state.jester} readOnly="true"/>
          <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,jesterTag)}>+</button>
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

export {setLocalUser, localUser, rolesRegistry};
