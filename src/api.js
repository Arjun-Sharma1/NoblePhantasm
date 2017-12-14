import openSocket from 'socket.io-client';
var socket = openSocket('http://localhost:8000');

function sendNewGameRequest(name) {
  socket.emit("newGame", name);
}

function sendJoinGameRequest(name, lobbyId) {
  socket.emit("joinGame", name, lobbyId);
}

function sendLeaveLobbyRequest(lobbyId) {
  socket.emit("leaveLobby", lobbyId);
}

function sendStartGameRequest(lobbyId) {
  socket.emit("startGame", lobbyId);
}

function checkValidLobby(lobbyId) {
  socket.emit("checkLobby", lobbyId);
}

export {
  sendNewGameRequest,
  sendLeaveLobbyRequest,
  sendJoinGameRequest,
  sendStartGameRequest,
  checkValidLobby,
  socket
};
