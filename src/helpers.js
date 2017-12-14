var HashMap = require('hashmap');

module.exports = {

    delegate: function(clientMap, delegatedRoles) {
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

        for (var i = 1; i < clientIds.length; i++) {
            delegatedRoles.set(clientMap.get(clientIds[i]), "townee");
        }

        return delegatedRoles;
    },

    assignAdmin: function(clientMap, socket) {
        var delegatedRoles = new HashMap();
        delegatedRoles.set(clientMap.get(socket), "admin");
        clientMap.remove(socket); //removing this client from hashmap as their role has been assigned as admin
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
