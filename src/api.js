import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function newGame(eventType, playerName) {
  socket.emit(eventType, playerName);
}

function joinGame(eventType, eventData, playerName) {
    socket.emit(eventType, eventData, playerName);
}

function startGame(lobbyId) {
    socket.emit('startGame');
}

//Just a temp var for testing purpose, will re-design the frontend organization
var lobbyId;

function recievedMessages(){
  socket.on('news',function(msg){
      console.log(msg);
  });
  socket.on('ngConf',function(msg){
    lobbyId = msg.lobby;  
    console.log(msg.lobby);
  });
  socket.on('jgConf',function(msg){
    lobbyId = msg.lobby;
    console.log(msg.lobby);
  });
}

export { newGame, recievedMessages};
