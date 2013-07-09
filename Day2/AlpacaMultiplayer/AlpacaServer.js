var io = require('socket.io').listen(8000);
io.set('log level', 1);

var players = {};
var coins = [];

io.sockets.on('connection', function (socket) {

	console.log('A socket with ID '+socket.id+'has connected to the server!');
	players[socket.id] = new Player (socket);
	sendGameState(socket);

	socket.on('changeDirection', function (newDir) { //x,y,vx,vy
		socket.emit('logged', "Welcome to the server!");
		var p = players[socket.id];
		p.x = newDir.x;
		p.y = newDir.y;
		p.vx = newDir.vx;
		p.vy = newDir.vy;

		for (var playerID in players) {
			if (socket.id != playerID) {
				players[playerID].emit('playerChangedDirection', newDir);
			}
		}

	});
});

var MAP_WIDTH =	800;
var MAP_HEIGHT = 600;

function Player (socket) {
	this.x = Math.floor(Math.random()*MAP_WIDTH);
	this.y = Math.floor(Math.random()*MAP_HEIGHT);
	this.vx = this.vy = 0;
	this.socket = socket;
}
Player.prototype.radius = 15;
Player.prototype.speed = 5;
Player.prototype.score = 0;
Player.prototype.logic = function () {
	this.x += this.vx;
	this.y += this.vy;
	this.collectCoins();
}

function objectHitTest(obj1, obj2) {
	return (Math.sqrt(Math.pow(obj2.x-obj1.x, 2)
		+ Math.pow(obj2.y-obj1.y,2)) < obj1.radius+obj2.radius);
}

Player.prototype.collectCoins = function () {
	for (var i = coins.length-1; i >= 0; --i) {
		var obj = coins[i];
		if (objectHitTest(this, obj)) {
			displayObjects.splice(i, 1);
			this.score += obj.points;
			needsGameStateUpdate = true;
		}
	}
}
Player.prototype.generatePacket = function () {
	var packet = {};
	packet.x = this.x;
	packet.y = this.y;
	packet.vx = this.vx;
	packet.vy = this.vy;
	return packet;
};
Player.prototype.disconnect = function () {
	delete players[this.socket.id];
	needsGameStateUpdate = true;
}

function sendGameState (socket) {
	var playersPacket = {};
	for (var playerID in players) {
		playersPacket[playerID] = players[playerID].generatePacket();
	}
	socket.emit('gameState', {players:playersPacket, coins:coins});
}

var needsGameStateUpdate = false;

function mainLoop () {
	needsGameStateUpdate = false;
	for (var playerID in players) {
		if (players[playerID].socket.disconnected) players[playerID].disconnect();
		else players[playerID].logic();
	}
	if (needsGameStateUpdate) {
		for (var playerID in players) {
			sendGameState(players[playerID].socket);
		}
	}
}

setInterval(mainLoop, 1000/60);
