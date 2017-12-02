import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function newGame(eventType, eventData) {
  socket.emit(eventType, eventData, "asdasd");
}

function recievedMessages(){
  socket.on('news',function(msg){
      console.log(msg);
  });
  socket.on('ngConf',function(msg){
      console.log(msg);
  });
  socket.on('jgConf',function(msg){
      console.log(msg);
  });
}

export { newGame, recievedMessages};
