var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var HashMap = require('hashmap');

var appPort = 3000;

var sessionId = 0;
var lobbyReg = new HashMap();

require('./app/routes')(app);
var helpers = require('./app/helpers');

io.on('connection', function(socket){
    console.log('User ' + socket.id +  ' has connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // socket.on('test', function(msg){
    //     console.log("server received: " + msg);
    //     socket.emit('news', { hello: msg });
    // });

    socket.on('newGame', function(name){
        //helpers.helper1();
        console.log("Server has recieved a new game request");
        
        sessionId++;
        var clientMap = new HashMap();
        clientMap.set(socket.id, name);
        lobbyReg.set(sessionId, clientMap);
        socket.emit('ngConf', { hello: "New game created for user: " + socket.id + " AND Session id is: " + sessionId});
    });

    socket.on('joinGame', function(gameId, name){
        
        console.log("Server has recieved a joinGame request for " + gameId + " from " + name);
        
        var reqJoinId = parseInt(gameId);
        
        if (lobbyReg.has(reqJoinId)){
            
            var clientMap = lobbyReg.get(reqJoinId);
            
            if (!clientMap.has(socket.id)){
                clientMap.set(socket.id, name);
                lobbyReg.set(reqJoinId, clientList);                
            } else {
                console.log('Client is already in the lobby')
            }
            // clientList.forEach(function(element) {
            //     io.to(element).emit('jgConf', 'connected client: ' + clientList);
            // })            
            //socket.emit('jgConf', { hello: "Game joined for: " + socket.id + " AND Session id is: " + sessionId});
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
        
        clientList.forEach(function(element) {
            
        })    
    });
});

server.listen(3000, function(){
    console.log('listening on ' + appPort)
})

exports = module.exports = app; 