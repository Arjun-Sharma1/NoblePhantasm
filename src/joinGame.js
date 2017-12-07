import { Switch, Route } from 'react-router-dom'
import React, { Component } from 'react';
import { sendJoinGameRequest, recievedMessages, socket } from './api';


export class joinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {gameCode: '',username: ''};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    recievedMessages();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.gameCode !== '' && this.state.username !== ''){
      sendJoinGameRequest(this.state.username, this.state.gameCode);
      let path = this.props.history;
      socket.on('ngConf',function(msg){
          if(msg.sessionId !== ''){
              path.push('/joinGame/'+msg.sessionId);
          }
      });
    }else{
      console.log("error gameCode empty or username empty");
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
        <form id="form4" onSubmit={this.handleSubmit} onChange={this.handleChange}>
            <input id="username" name='username' value={this.state.username} placeholder="Enter name"/>
            <br></br>
            <input id="gameCode" name='gameCode' value={this.state.gameCode} placeholder="Enter Lobby Id"/>
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
    this.state = {gameCode: props.match.params, users: []};
  }

  addUsers(username){
    let holder = this.state.users;
    username.map(function(user){
      if(!holder.includes(user)){
        holder.push(user);
      }
      return true;
    })
    this.setState({users: holder});
  }

  render() {
    socket.on('userJoined',function(msg){
        if(msg.userId !== '' && !this.state.users.includes(msg.userId)){
            this.addUsers(msg.userId);
        }
    }.bind(this));

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Connected to Gameroom: {this.state.gameCode.number}</h1>
          <h4>Current People in Lobby: </h4>
          <ul>
          {this.state.users.map(function(listValue){
            return <li key={listValue}>{listValue}</li>;
          })}
          </ul>
        </header>
      </div>
    );
  }

}
