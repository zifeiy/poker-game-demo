var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	var clientIp = socket.handshake.address;
	socket.emit('connected', '' + clientIp);
	console.log('a user connected,ip = ' + clientIp);
});

http.listen(8012, function () {
	console.log('listening on : 8012');
});