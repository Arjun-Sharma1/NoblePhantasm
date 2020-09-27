var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
// const io = require('socket.io')();


var HashMap = require('hashmap');
var helper = require('./src/backend/helper.js');

var lobbyReg = new HashMap();


io.on('connection', function(socket) {
  console.log('User ' + socket.id + ' has connected');

  socket.on('disconnect', function() {
    console.log(lobbyReg.entries());
    let holder = lobbyReg.entries();
    for (var i = 0; i < holder.length; i++) {
      if (holder[i][1].has(socket.id)) {
        holder[i][1].delete(socket.id);
        io.local.emit(holder[i][0], {
          userId: holder[i][1].values()
        });
        if (holder[i][1].size == 0) {
          lobbyReg.delete(holder[i][0]);
          console.log("Removed dead Lobby: " + holder[i][0]);
        }
        break;
      }
    }
    console.log('user disconnected');
  });

  socket.on('newGame', function(name) {
    console.log("Server has recieved a new game request");
    var lobbyId = helper.generateLobbyId(lobbyReg);
    var clientMap = new HashMap();
    clientMap.set(socket.id, name);
    lobbyReg.set(lobbyId, clientMap);
    socket.emit('ngConf', {
      lobbyId: lobbyId
    });
    io.local.emit(lobbyId, {
      userId: clientMap.values()
    });
  });

  socket.on('joinGame', function(name, lobbyId) {

    console.log("Server has recieved a joinGame request for " + lobbyId + " from " + name);

    if (lobbyReg.has(lobbyId)) {

      var clientMap = lobbyReg.get(lobbyId);

      if (!clientMap.has(socket.id)) {
        clientMap.set(socket.id, name);
        lobbyReg.set(lobbyId, clientMap);
        socket.emit('ngConf', {
          lobbyId: lobbyId
        });
        io.local.emit(lobbyId, {
          userId: clientMap.values()
        });
      } else {
        socket.emit('errorMessage', {
          errorMessage: 'User Already In lobby'
        });
        console.log('Client is already in the lobby');
      }
    } else {
      socket.emit('errorMessage', {
        errorMessage: 'Lobby does not exist'
      });
      console.log("Lobby " + lobbyId + " doesn't exist");
    }

  });

  socket.on('resetGame', function(lobbyId){
    console.log("Recieved Return to Lobby Request")
    io.local.emit("resetGame");
  });

  socket.on('leaveLobby', function(lobbyId) {

    if (lobbyReg.has(lobbyId)) {

      var clientMap = lobbyReg.get(lobbyId);
      var clientName = clientMap.get(socket.id);

      console.log("Server has recieved a new leave request for user: " + clientName + " in lobby: " + lobbyId);

      if (clientMap.has(socket.id)) {
        clientMap.delete(socket.id, clientName);
        socket.emit('leaveLobby', {
          left: 'true'
        });
        io.local.emit(lobbyId, {
          userId: clientMap.values()
        });
        console.log(clientName + " has left the lobby successfully");
        if (clientMap.size == 0) {
          lobbyReg.delete(lobbyId);
          console.log("Removed dead Lobby: " + lobbyId);
        }
      } else {
        console.log('Client has already left the lobby or clientName does not exist');
      }
    } else {
      console.log("Lobby " + lobbyId + " doesn't exist");
    }
  });

  socket.on('startGame', function(lobbyId, countMap) {

    console.log("Start game request recieved for " + lobbyId + ", delegating roles...");
    var originalMap = lobbyReg.get(lobbyId);
    var clientMap = new HashMap(originalMap);
    var roleCountMap = new HashMap(countMap);

    console.log("test count: " + roleCountMap.get("assassin"));

    if (clientMap.size >= 2) {
      var delegatedRoles = helper.assignmoderator(clientMap, socket.id);
      delegatedRoles = helper.delegate(clientMap, delegatedRoles, roleCountMap);
      lobbyReg.get(lobbyId).forEach(function(value, key) {
        io.to(key).emit('startGameConf', delegatedRoles);
      });
    } else {
      lobbyReg.get(lobbyId).forEach(function(value, key) {
        io.to(key).emit('startGameConf', 'Not enough players');
      });
    }
  });

  socket.on('checkLobby', function(lobbyId) {
    if (lobbyReg.has(lobbyId)) {
      var clientMap = lobbyReg.get(lobbyId);
      socket.emit('checkLobby', {
        valid: 'true',
        users: clientMap.values()
      });
    } else {
      socket.emit('checkLobby', {
        valid: 'false',
        users: []
      });
    }
  });

});

const port =process.env.PORT || 8000;
if(port !== 8000){
  console.log("Using production Build");
  app.use(express.static('build'));
}

server.listen(port);
// const port = 8000;
// io.listen(port);

console.log('listening on port ', port);
