var express = require('express');

var app = express();

//var io = require('socket.io')(app);
//need a server handler instance

//The port that the application will be running on
var appPort = 3000;

//app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

app.listen(appPort);

console.log('Application port is ' + appPort)

exports = module.exports = app; 