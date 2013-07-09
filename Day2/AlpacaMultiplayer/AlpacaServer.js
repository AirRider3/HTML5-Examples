var io = require('socket.io').listen(8000);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	console.log('A socket has connected to the server!');

	socket.on('changeDirection', function (newDir) {
		socket.emit('logged', "Welcome to the server!");
	});
});


//var socket = io.connect('http://localhost:8000');