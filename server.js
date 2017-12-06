var HashMap = require('hashmap');
const io = require('socket.io')();

var lobbyReg = new HashMap();
var helpers = require('./src/helpers.js');

io.on('connection', function(socket){
    console.log('User ' + socket.id +  ' has connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('newGame', function(name){
        //helpers.helper1();
        console.log("Server has recieved a new game request");
        var temp = helpers.generateLobbyId(lobbyReg);
        var lobbyId = helpers.generateLobbyId(lobbyReg);
        var clientMap = new HashMap();
        clientMap.set(socket.id, name);
        lobbyReg.set(lobbyId, clientMap);
        socket.emit('ngConf', { hello: "New game created for user: " + socket.id + " AND Lobby id is: " + lobbyId});
    });

    socket.on('joinGame', function(lobbyId, name){

        console.log("Server has recieved a joinGame request for " + lobbyId + " from " + name);

        if (lobbyReg.has(lobbyId)){

            var clientMap = lobbyReg.get(lobbyId);

            if (!clientMap.has(socket.id)){
                clientMap.set(socket.id, name);
                lobbyReg.set(lobbyId, clientMap);
            } else {
                console.log('Client is already in the lobby')
            }
        } else {
            console.log("Lobby " + lobbyId + " doesn't exist")
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
