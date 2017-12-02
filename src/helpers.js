module.exports = {
    delegate: function(clientMap){
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

        var delegatedRoles = new HashMap();
        delegatedRoles.set(clientIds[0], "assassin");

        for (var i = 1; i < clientIds.length; i++){
            delegatedRoles.set(clientIds[i], "townee");
        }

        return delegatedRoles;
    },
    assignAdmin: function(clientId){
        var delegatedRoles = new HashMap();
        delegatedRoles.set(clientId, "admin");
        return delegatedRoles;
    }
};
