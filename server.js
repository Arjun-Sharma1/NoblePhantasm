var HashMap = require('hashmap');
const io = require('socket.io')();

var sessionId = 0;
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

        sessionId++;
        var clientMap = new HashMap();
        clientMap.set(socket.id, name);
        lobbyReg.set(sessionId, clientMap);
        socket.emit('ngConf', { sessionId: sessionId});
        io.local.emit('userJoined', {userId: clientMap.values()});
    });

    socket.on('joinGame', function(name, gameId){

        console.log("Server has recieved a joinGame request for " + gameId + " from " + name);

        var reqJoinId = parseInt(gameId);

        if (lobbyReg.has(reqJoinId)){

            var clientMap = lobbyReg.get(reqJoinId);

            if (!clientMap.has(socket.id)){
                clientMap.set(socket.id, name);
                lobbyReg.set(reqJoinId, clientMap);
                socket.emit('ngConf', {sessionId: reqJoinId});
                io.local.emit('userJoined', {userId: clientMap.values()});
            } else {
                console.log('Client is already in the lobby')
            }
        } else {
            console.log("Lobby " + gameId + " doesn't exist")
        }

    });

    socket.on('startGame', function(gameId){
        console.log("Start game request recieved for " + gameId + ", delegating roles...");

        var clientMap = new HashMap(lobbyReg.get(gameId));
        var delegatedRoles = helpers.assignAdmin(socket.id);
        clientMap.remove(socket.id); //removing this client from hashmap as their role has been assigned as admin
        var delegatedRoles = helpers.delegate(clientMap);

        lobbyReg.get(gameId).forEach(function(value, key) {
            io.to(element).emit('startGameConf', delegatedRoles);
        });

        clientMap.forEach(function(element) {

        })
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
