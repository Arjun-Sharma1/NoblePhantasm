const io = require('socket.io')();
var HashMap = require('hashmap');
var helpers = require('./src/helpers.js');

var lobbyReg = new HashMap();


io.on('connection', function(socket){
    console.log('User ' + socket.id +  ' has connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('newGame', function(name){
        //helpers.helper1();
        console.log("Server has recieved a new game request");

        var lobbyId = helpers.generateLobbyId(lobbyReg);
        var clientMap = new HashMap();
        clientMap.set(socket.id, name);
        lobbyReg.set(lobbyId, clientMap);
        socket.emit('ngConf', { lobbyId: lobbyId});
        io.local.emit('userJoined', {userId: clientMap.values()});
    });

    socket.on('joinGame', function(name, lobbyId){

        console.log("Server has recieved a joinGame request for " + lobbyId + " from " + name);

        if (lobbyReg.has(lobbyId)){

            var clientMap = lobbyReg.get(lobbyId);

            if (!clientMap.has(socket.id)){
                clientMap.set(socket.id, name);
                lobbyReg.set(lobbyId, clientMap);
                socket.emit('ngConf', {lobbyId: lobbyId});
                io.local.emit('userJoined', {userId: clientMap.values()});
            } else {
                console.log("test");
                socket.emit('errorMessage', {errorMessage: 'User Already In lobby'});
                console.log('Client is already in the lobby');
            }
        } else {
            socket.emit('errorMessage', {errorMessage: 'Lobby does not exist'});
            console.log("Lobby " + lobbyId + " doesn't exist");
        }

    });

    socket.on('leaveLobby', function(name,lobbyId){
        //helpers.helper1();
        console.log("Server has recieved a new leave request for user: " + name + " in lobby: " + lobbyId);

        if (lobbyReg.has(lobbyId)){

            var clientMap = lobbyReg.get(lobbyId);

            if (clientMap.has(socket.id)){
                clientMap.remove(socket.id, name);
                console.log(clientMap);
                socket.emit('leaveLobby', {left: 'true'});
                io.local.emit('userJoined', {userId: clientMap.values()});
                console.log(name+" has left the lobby successfully");
            } else {
                console.log('Client has already left the lobby or clientName does not exist');
            }
        } else {
            console.log("Lobby " + lobbyId + " doesn't exist");
        }
    });

    socket.on('startGame', function(lobbyId){
        console.log("Start game request recieved for " + lobbyId + ", delegating roles...");

        var clientMap = new HashMap(lobbyReg.get(lobbyId));
        var delegatedRoles = helpers.assignAdmin(socket.id);
        clientMap.remove(socket.id); //removing this client from hashmap as their role has been assigned as admin
        var delegatedRoles = helpers.delegate(clientMap);

        lobbyReg.get(lobbyId).forEach(function(value, key) {
            io.to(element).emit('startGameConf', delegatedRoles);
        });

        clientMap.forEach(function(element) {

        })
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
