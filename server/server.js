var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var sample = require("./routes/Sample");
var fileUpload = require('express-fileupload');
sample.app.myApp = io;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
app.use(fileUpload());
var router = require("./routes/index");
app.use(router);
app.set('port', process.env.PORT || 9090);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
http.listen(9091);
module.exports = app;