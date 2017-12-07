import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';
import { sendJoinGameRequest,sendLeaveLobbyRequest, recievedMessages, socket } from './api';
var localUser = '';


export class joinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {lobbyId: '',username: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    recievedMessages();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.lobbyId !== '' && this.state.username !== ''){
      sendJoinGameRequest(this.state.username, this.state.lobbyId);
      let path = this.props.history;
      socket.on('ngConf',function(msg){
          if(msg.lobbyId !== ''){
              localUser = this.state.username;
              path.push('/joinGame/'+msg.lobbyId);
          }
      }.bind(this));
    }else{
      console.log("error lobbyId empty or username empty");
    }
    //Stop from refreshing the page
    event.preventDefault();
  }

  goToLanding() {
    localUser = '';
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Noble Phantasm</h1>
        </header>
        <form id="form4" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <input id="username" name='username' value={this.state.username} placeholder="Enter name"/>
            <br></br>
            <input id="lobbyId" name='lobbyId' value={this.state.lobbyId} placeholder="Enter Lobby Id"/>
            <button>Join Game</button>
        </form>
        <button onClick={this.goToLanding}>
          Back
        </button>
        <Switch>
          <Route path='/joinGame/:number' component={joinGameID}/>
        </Switch>
      </div>
    );
  }
}

export class joinGameID extends Component {
  constructor(props) {
    super(props);
    this.state = {lobbyId: props.match.params, users: []};
    this.leaveLobby = this.leaveLobby.bind(this);
    this.addUsers = this.addUsers.bind(this);
  }

  addUsers(username){
    let holder = [];
    username.map(function(user){
      if(!holder.includes(user) && holder.user!== ''){
        holder.push(user);
      }
      return true;
    })
    //Check if component is fully mounted before setting state
    if(this.refs.joinGame) {
      this.setState({users: holder});
    }
  }

  leaveLobby() {
    sendLeaveLobbyRequest(localUser, this.state.lobbyId.number);
    localUser = '';
    socket.on('leaveLobby',function(msg){
        this.props.history.push('/');
    }.bind(this));
  }

  render() {
    socket.on('userJoined',function(msg){
        if(msg.userId !== undefined && !this.state.users.includes(msg.userId) && localUser !== ''){
          console.log(msg.userId);
          this.addUsers(msg.userId);
        }
    }.bind(this));

    return (
      <div ref="joinGame" className="App">
        <header className="App-header">
          <h1 className="App-title">Waiting for Players...</h1>
          <h3>Lobby Code: {this.state.lobbyId.number}</h3>
          <h4>Current People in Lobby: </h4>
        </header>
        <ul>
        {this.state.users.map(function(listValue,index){
          return <li key={index}>{listValue}</li>;
        })}
        </ul>
        <button>Start Game</button>
        <button onClick={this.leaveLobby}>Leave Game</button>
      </div>
    );
  }
}

function setLocalUser(username){
  localUser = username;
};

export { setLocalUser};
