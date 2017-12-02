var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var HashMap = require('hashmap');

var appPort = 3000;

var sessionId = 0;
var lobbyReg = new HashMap();

require('./app/routes')(app);

io.on('connection', function(socket){
    console.log('user connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('test', function(msg){
        console.log("server received: " + msg);
        socket.emit('news', { hello: msg });
    });

    socket.on('ng', function(msg){
        console.log("server ng request received");
        sessionId++;
        lobbyReg.set(sessionId, [socket.id]); //NEED TO STORE A HASHMAP IN LOBBYREG WITH SOCKETID,NAME
        socket.emit('ngConf', { hello: "New game created for user: " + socket.id + " AND Session id is: " + sessionId});
    });

    socket.on('jg', function(msg){
        console.log("server jg request received: " + msg);
        var reqJoinId = parseInt(msg);
        if (lobbyReg.has(reqJoinId)){
            var clientList = lobbyReg.get(reqJoinId);
            clientList.push(socket.id);
            lobbyReg.set(reqJoinId, clientList)
            console.log(lobbyReg.get(reqJoinId));
            
            clientList.forEach(function(element) {
                io.to(element).emit('jgConf', 'connected client: ' + clientList);
            });
            
            //socket.emit('jgConf', { hello: "Game joined for: " + socket.id + " AND Session id is: " + sessionId});
        } else {
            console.log("no lobby dawg")
            socket.emit('jgConf', { hello: "Cant join"});
        }
        
    });

});

server.listen(3000, function(){
    console.log('listening on ' + appPort)
})

exports = module.exports = app; 