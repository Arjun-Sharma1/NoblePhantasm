var HashMap = require('hashmap');

var towneeTag = "townee";
var moderatorTag = "moderator";

module.exports = {

  delegate: function(clientMap, delegatedRoles, roleCountMap) {
    var clientIds = [];

    clientMap.forEach(function(value, key) {
      clientIds.push(key);
    });

    //Randomizing clients in an array
    for (var i = clientIds.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = clientIds[i];
      clientIds[i] = clientIds[j];
      clientIds[j] = temp;
    }

    var clientCounter = 0;

    //Assign special roles base on role count from client side
    roleCountMap.forEach(function(value, key) {
      for (var i = 0; i < value; i++){        
        delegatedRoles.set(clientMap.get(clientIds[clientCounter]), key);
        clientCounter++;
      }
    });

    //Assign townees to the remaining players
    for (var i = clientCounter; i < clientIds.length; i++) {
      delegatedRoles.set(clientMap.get(clientIds[i]), towneeTag);
    }

    return delegatedRoles;
  },

  assignmoderator: function(clientMap, socket) {
    var delegatedRoles = new HashMap();
    delegatedRoles.set(clientMap.get(socket), moderatorTag);
    clientMap.remove(socket); //removing this client from hashmap as their role has been assigned as moderator
    return delegatedRoles;
  },

  generateLobbyId: function(lobbyReg) {
    var lobbyId;
    do {
      lobbyId = Math.random().toString(36).substr(2, 5);
    }
    while (lobbyReg.has(lobbyId));
    return lobbyId;
  }

};
