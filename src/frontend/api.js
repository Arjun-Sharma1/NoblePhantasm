import io from 'socket.io-client';
var socket = io();
//import openSocket from 'socket.io-client';
//var socket = openSocket('http://localhost:8000');

function sendNewGameRequest(name) {
  socket.emit("newGame", name);
}

function sendJoinGameRequest(name, lobbyId) {
  socket.emit("joinGame", name, lobbyId);
}

function sendLeaveLobbyRequest(lobbyId) {
  socket.emit("leaveLobby", lobbyId);
}

function sendStartGameRequest(lobbyId, roleCountMap) {
  socket.emit("startGame", lobbyId, roleCountMap);
}

function sendRestartGameRequest(name) {
  socket.emit("resetGame", name);
}

function checkValidLobby(lobbyId) {
  socket.emit("checkLobby", lobbyId);
}

export {
  sendNewGameRequest,
  sendLeaveLobbyRequest,
  sendJoinGameRequest,
  sendStartGameRequest,
  sendRestartGameRequest,
  checkValidLobby,
  socket
};
