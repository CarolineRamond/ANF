var express = require('express');

var server = express();

server.get('/', function (req, res) {
	res.sendfile('index.html');
});

server.listen(8000, function () {
	console.log('Server now listening on port 8000');
});