module.exports = {
    delegate: function(clientMap){
        
    },
    assignAdmin: function(clientId){
        var delegatedRoles = new HashMap();
        delegatedRoles.set(clientId, "admin");
        return delegatedRoles;
    }
};  