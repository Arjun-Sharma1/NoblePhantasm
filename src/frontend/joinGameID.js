import React, { Component, Fragment } from 'react';
import { sendLeaveLobbyRequest, sendStartGameRequest, sendRestartGameRequest, socket, checkValidLobby } from './api';
var HashMap = require('hashmap');
var roles;

export default class joinGameID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: props.match.params,
      users: [],
      gameRenderState:0,
      errorMessage: '',
      lobbyChecked: false,
      roles:{assassin:1, detective:0, doctor:0, jester:0, vigilante:0},
      newRoleName: "",
      userRole: ''
    };

    if(!this.state.lobbyChecked){
      checkValidLobby(this.state.lobbyId.number);
      this.setState({lobbyChecked:true})
    }

    this.startGame = this.startGame.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.addUsers = this.addUsers.bind(this);
    this.decidePage = this.decidePage.bind(this);
    this.decrementRoleCountHandler = this.decrementRoleCountHandler.bind(this);
    this.incrementRoleCountHandler = this.incrementRoleCountHandler.bind(this);
    this.collectRoleCount = this.collectRoleCount.bind(this);
    this.checkRoleCount = this.checkRoleCount.bind(this);
    this.gameRender = this.gameRender.bind(this);
    this.extractRoles = this.extractRoles.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.handleNewRoleText = this.handleNewRoleText.bind(this);
    this.addNewRole = this.addNewRole.bind(this);
  }

  componentDidMount() {
    //Inital Load, check if lobby valid and set users
    socket.on('checkLobby', function(msg) {
      if (msg.valid === 'false') {
        this.props.history.push('/');
      }else{
        this.addUsers(msg.users);
      }
    }.bind(this));

    //Used for updating users when new person joins
    socket.on(this.state.lobbyId.number, function(msg) {
      if (msg.userId !== undefined && this.state.users !== msg.userId.length && !this.state.users.includes(msg.userId)) {
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
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.users === nextState.users) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  addUsers(username) {
    let holder = [];
    username.map(function(user) {
      if (!holder.includes(user) && holder.user !== '') {
        holder.push(user);
      }
      return true;
    })
    this.setState({users: holder});
  }

  startGame() {
    if (this.state.users.length >= 2) {
      let checkCountFlag = this.checkRoleCount();
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
    this.props.setUsername('');
    this.props.history.push('/');
  }

  decidePage(assignedRoles) {
    roles = new HashMap(assignedRoles);
    this.setState({userRole: roles.get(this.props.username)});
    if (assignedRoles.get(this.props.username) === "moderator") {
      this.setState({gameRenderState:1});
    } else {
      this.setState({gameRenderState:2});
    }
  }

  collectRoleCount(){
    var countMap = new HashMap();
    for (const key of Object.keys(this.state.roles)){
      countMap.set(key, this.state.roles[key])
    }
    console.log(countMap);
    return countMap;
  }

  checkRoleCount(){
    //Subtract 1 for moderator
    var sum = Object.keys(this.state.roles).reduce((sum,key)=>sum+parseFloat(this.state.roles[key]||0),0) + 1
    if(sum <= this.state.users.length){
      if(this.state.roles['assassin'] > 0){
        return true;
      }else{
        this.setState({errorMessage: "Must have minimum of 1 Assassin"});
      }
    }else {
      this.setState({errorMessage: "Number of Roles exceeds Number of Players"});
      return false;
    }
  }

  incrementRoleCountHandler(event, roleType) {
    event.preventDefault();
    if(this.state.roles[roleType]+1 >= 0){
      let newState = {...this.state.roles}
      newState[roleType] += 1
      this.setState({
        roles:newState
      });
    }
  }

  decrementRoleCountHandler(event, roleType) {
    event.preventDefault();
    if(this.state.roles[roleType]-1 >= 0){
      let newState = {...this.state.roles}
      newState[roleType] -= 1
      this.setState({
        roles:newState
      });
    }
  }

  extractRoles(){
      var temp = [];
      roles.forEach(function(value, key) {
          temp.push(key + ': ' + value);
      });
      return temp;
   }

   handleNewRoleText(e){
     this.setState({
       newRoleName:e.target.value
     })
   }

   addNewRole(e){
     e.preventDefault();
     let newRoles = {...this.state.roles}
     newRoles[this.state.newRoleName] = 1
     this.setState({
       newRoleName: '',
       roles:newRoles
     })
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
                  {Object.keys(this.state.roles).map(x=>{
                    return (
                      <Fragment>
                      <h4>{x.charAt(0).toUpperCase() + x.slice(1)}</h4>
                          <button className='decrementBtn' onClick={ (e) => this.decrementRoleCountHandler(e,x)}>-</button>
                          <input value={this.state.roles[x]} readOnly="true"/>
                          <button className='incrementBtn' onClick={ (e) => this.incrementRoleCountHandler(e,x)}>+</button>
                       </Fragment>
                  )})
                }
                <h4>Add New Role:</h4>
                <input value={this.state.newRoleName} onChange={this.handleNewRoleText} />
                <button onClick={this.addNewRole} className='decrementBtn'>Add Role</button>
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
                    <h1>{this.props.username}</h1>
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
                  <h1>{this.props.username}</h1>
                  <h3>You have been assigned {this.state.userRole}!</h3>
              </div>
            </div>
          )
        }
  }

  render() {
    return (
      <div className="App">
        {this.gameRender()}
      </div>
    );
  }
}
