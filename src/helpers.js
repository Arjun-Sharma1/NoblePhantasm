var HashMap = require('hashmap');

module.exports = {

  delegate: function(clientMap, delegatedRoles, roleCountMap) {
    var clientIds = [];

    clientMap.forEach(function(value, key) {
      clientIds.push(key);
    });

    for (var i = clientIds.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = clientIds[i];
      clientIds[i] = clientIds[j];
      clientIds[j] = temp;
    }

    delegatedRoles.set(clientMap.get(clientIds[0]), "assassin");

    delegatedRoles.set(clientMap.get(clientIds[1]), "Jester");

    delegatedRoles.set(clientMap.get(clientIds[2]), "Doctor");

    delegatedRoles.set(clientMap.get(clientIds[3]), "Detective");

    for (var i = 4; i < clientIds.length; i++) {
      delegatedRoles.set(clientMap.get(clientIds[i]), "townee");
    }

    return delegatedRoles;
  },

  assignmoderator: function(clientMap, socket) {
    var delegatedRoles = new HashMap();
    delegatedRoles.set(clientMap.get(socket), "moderator");
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
