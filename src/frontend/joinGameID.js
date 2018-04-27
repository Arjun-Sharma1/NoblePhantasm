import React, { Component } from 'react';
import { sendLeaveLobbyRequest, sendStartGameRequest, sendRestartGameRequest, socket, checkValidLobby } from './api';
var HashMap = require('hashmap');
var localUser = "";
var assassinTag = "assassin";
var vigilanteTag = "vigilante";
var doctorTag = "doctor";
var detectiveTag = "detective";
var jesterTag = "jester";
var roles;

export class joinGameID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: props.match.params,
      users: [],
      gameRenderState:0,
      errorMessage: '',
      vigilante:0,
      doctor:0,
      jester:0,
      detective:0,
      assassin:1,
      username: localUser,
      userRole: ''
    };

    checkValidLobby(this.state.lobbyId.number);

    this.startGame = this.startGame.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.addUsers = this.addUsers.bind(this);
    this.decidePage = this.decidePage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.decrementRoleCountHandler = this.decrementRoleCountHandler.bind(this);
    this.incrementRoleCountHandler = this.incrementRoleCountHandler.bind(this);
    this.collectRoleCount = this.collectRoleCount.bind(this);
    this.checkRoleCount = this.checkRoleCount.bind(this);
    this.gameRender = this.gameRender.bind(this);
    this.extractRoles = this.extractRoles.bind(this);
    this.resetGame = this.resetGame.bind(this);

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
    while (!this.refs.joinGame) {
      console.log("Waiting for component to mount")
    };
    this.setState({users: holder});
  }

  startGame() {
    if (this.state.users.length >= 2) {
      var checkCountFlag = this.checkRoleCount();
      if(checkCountFlag){
        var roleCountMap = this.collectRoleCount();
        this.setState({errorMessage: ''});
        sendStartGameRequest(this.state.lobbyId.number, roleCountMap);
      }
    } else {
      this.setState({errorMessage: "Must have a minimum of 5 Players to Start"});
    }
  }

  resetGame(){
    sendRestartGameRequest(this.state.lobbyId.number);
  }

  leaveLobby() {
    sendLeaveLobbyRequest(this.state.lobbyId.number);
    this.setState({errorMessage: ''});
    localUser = '';
    socket.on('leaveLobby', function(msg) {
      this.props.history.push('/');
    }.bind(this));
  }

  decidePage(assignedRoles) {
    roles = new HashMap(assignedRoles);
    this.setState({userRole: roles.get(localUser)});
    if (assignedRoles.get(localUser) === "moderator") {
      this.setState({gameRenderState:1});
    } else {
      this.setState({gameRenderState:2});
    }
  }

  collectRoleCount(){
    var countMap = new HashMap();
    countMap.set(assassinTag, this.state.assassin);
    countMap.set(vigilanteTag, this.state.vigilante);
    countMap.set(doctorTag, this.state.doctor);
    countMap.set(jesterTag, this.state.jester);
    countMap.set(detectiveTag, this.state.detective);
    return countMap;
  }

  checkRoleCount(){
    //Subtract 1 for moderator
    var sum = this.state.assassin + this.state.vigilante + this.state.doctor + this.state.jester + this.state.detective+1;
    if(sum <= this.state.users.length){
      if(this.state.assassin > 0){
        return true;
      }else{
        this.setState({errorMessage: "Must have minimum of 1 Assassin"});
      }
    }else {
      this.setState({errorMessage: "Number of Roles exceeds Number of Players"});
      return false;
    }
  }

  incrementRoleCountHandler(event, roleType, roleCount) {
    event.preventDefault();
    if(roleCount+1 >= 0){
      var newState = {};
      newState[roleType] = roleCount+1;
      this.setState(newState);
    }
  }

  decrementRoleCountHandler(event, roleType, roleCount) {
    event.preventDefault();
    if(roleCount-1 >= 0){
      var newState = {};
      newState[roleType] = roleCount-1;
      this.setState(newState);
    }
  }

  extractRoles(){
      var temp = [];
      roles.forEach(function(value, key) {
          temp.push(key + ': ' + value);
      });
      return temp;
   }

  gameRender(){
    if(this.state.gameRenderState === 0){
        return(
          <div ref="joinGame">
            <header className="App-header">
                  <h6 className="App-title">Waiting for Players...</h6>
                  <h2>Lobby Code: {this.state.lobbyId.number}</h2>
                </header>
                <hr width="35%"></hr>
                <ul>
                {this.state.users.map(function(listValue,index) {
                  return <li key={index}><a href="#">{listValue}</a></li>;
                })}
                </ul>
                <hr width="35%"></hr>
                <h3>Role Picker</h3>
                <form className="rolePicker" id="rolePicker" name="rolePicker">
                  <h4>Assassin</h4>
                  <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,assassinTag, this.state.assassin)}>-</button>
                  <input value={this.state.assassin} readOnly="true"/>
                  <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,assassinTag, this.state.assassin)}>+</button>
                  <h4>Vigilante</h4>
                  <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,vigilanteTag, this.state.vigilante)}>-</button>
                  <input value={this.state.vigilante} readOnly="true"/>
                  <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,vigilanteTag, this.state.vigilante)}>+</button>
                  <h4>Doctor</h4>
                  <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,doctorTag, this.state.doctor)}>-</button>
                  <input value={this.state.doctor} readOnly="true"/>
                  <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,doctorTag, this.state.doctor)}>+</button>
                  <h4>Detective</h4>
                  <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,detectiveTag, this.state.detective)}>-</button>
                  <input value={this.state.detective} readOnly="true"/>
                  <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,detectiveTag, this.state.detective)}>+</button>
                  <h4>Jester</h4>
                  <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,jesterTag, this.state.jester)}>-</button>
                  <input value={this.state.jester} readOnly="true"/>
                  <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,jesterTag, this.state.jester)}>+</button>
                </form>
                <button className='buttonPlay' onClick={this.startGame}>Start Game</button>
                <button className='buttonLeave' onClick={this.leaveLobby}>Leave Game</button>
                <div className='errorMessage'>{this.state.errorMessage}</div>
            </div>
              )
        }else if(this.state.gameRenderState === 1){
          this.extractRoles();
          return(
            <div ref="moderator" className="App">
                <div>
                    <h1>{this.state.username}</h1>
                    <h3>You are the {this.state.userRole}!</h3>
                    <p>Power Used || Dead</p>
                    <ul>
                        {this.extractRoles().map(function(listValue,index) {
                        return <li key={index}><input type="checkbox"/><input type="checkbox"/><a href="#"> {listValue}</a></li>;
                        })}
                    </ul>
                </div>
                <button className='buttonLeave' onClick={this.resetGame}>Back to Lobby</button>
            </div>
          )
        }else if(this.state.gameRenderState === 2){
          return(
            <div ref="roles" className="App">
              <div>
                  <h1>{this.state.username}</h1>
                  <h3>You have been assigned {this.state.userRole}!</h3>
              </div>
            </div>
          )
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

    socket.on('resetGame', function(msg) {
      this.setState({gameRenderState:0});
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
      <div className="App">
        {this.gameRender()}
      </div>
    );
  }
}

function setLocalUser(username) {
  localUser = username;
};

export {setLocalUser, localUser};
