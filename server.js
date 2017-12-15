const io = require('socket.io')();
var HashMap = require('hashmap');
var helpers = require('./src/helpers.js');

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
    var lobbyId = helpers.generateLobbyId(lobbyReg);
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

  socket.on('startGame', function(lobbyId) {

    console.log("Start game request recieved for " + lobbyId + ", delegating roles...");
    var originalMap = lobbyReg.get(lobbyId);
    var clientMap = new HashMap(originalMap);
    if (clientMap.size >= 2) {
      var delegatedRoles = helpers.assignmoderator(clientMap, socket.id);
      delegatedRoles = helpers.delegate(clientMap, delegatedRoles);
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
      socket.emit('checkLobby', {
        valid: 'true'
      });
    } else {
      socket.emit('checkLobby', {
        valid: 'false'
      });
    }
  });

});

var port = process.env.PORT;
io.listen(port);
console.log('listening on port ', port);
