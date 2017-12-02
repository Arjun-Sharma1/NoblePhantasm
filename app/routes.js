var path = require("path");

module.exports = function(app) {

    app.get('/start', function(req, res){
        res.send('hello world from routes.js');
    })

    app.get('/', function(req, res) {        
        res.sendFile(path.join(__dirname, '../public/views', 'index.html'));
    });

}