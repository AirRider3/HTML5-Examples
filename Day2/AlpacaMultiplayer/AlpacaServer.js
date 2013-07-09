var io = require('socket.io').listen(8000);
io.set('log level', 1);

var players = {};
var coins = [];

io.sockets.on('connection', function (socket) {

	console.log('A socket with ID '+socket.id+'has connected to the server!');
	players[socket.id] = new Player (socket);

	socket.emit('logged', socket.id);

	var sockets = [];
	for (var playerID in players) sockets.push(players[playerID].socket);
	sendGameState(sockets);

	socket.on('changeDirection', function (newDir) { //x,y,vx,vy
		var p = players[socket.id];
		p.x = newDir.x;
		p.y = newDir.y;
		p.vx = newDir.vx;
		p.vy = newDir.vy;

		newDir.playerID = socket.id;

		for (var playerID in players) {
			if (socket.id != playerID) {
				players[playerID].socket.emit('playerChangedDirection', newDir);
			}
		}

	});
});

var MAP_WIDTH =	400;
var MAP_HEIGHT = 400;

function Player (socket) {
	this.x = Math.floor(Math.random()*MAP_WIDTH);
	this.y = Math.floor(Math.random()*MAP_HEIGHT);
	this.vx = this.vy = 0;
	this.socket = socket;
	this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
}
Player.prototype.radius = 15;
Player.prototype.speed = 5;
Player.prototype.score = 0;
Player.prototype.logic = function () {
	this.x += this.vx*delta/16;
	this.y += this.vy*delta/16;
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
			coins.splice(i, 1);
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
	packet.color = this.color;
	packet.id = this.socket.id;
	return packet;
};
Player.prototype.disconnect = function () {
	delete players[this.socket.id];
	needsGameStateUpdate = true;
}

function Coin () {
	this.x = Math.floor(Math.random()*MAP_WIDTH);
	this.y = Math.floor(Math.random()*MAP_HEIGHT);
	this.point = 5 + Math.floor(Math.random()*5)*5;
}
Coin.prototype.radius = 15;


function sendGameState (sockets) {
	var playersPacket = {};
	for (var playerID in players) {
		playersPacket[playerID] = players[playerID].generatePacket();
	}
	for (var i = 0; i < sockets.length; ++i) {
		sockets[i].emit('gameState', {players:playersPacket, coins:coins});
	}
}

var needsGameStateUpdate = false;

var oldDate = +new Date();
var delta = 0;

function mainLoop () {

	var currentDate = +new Date();
	delta = currentDate - oldDate;
	oldDate = currentDate;

	needsGameStateUpdate = false;
	for (var playerID in players) {
		if (players[playerID].socket.disconnected) players[playerID].disconnect();
		else players[playerID].logic();
	}
	
	if (needsGameStateUpdate) {
		var sockets = [];
		for (var playerID in players) {
			sockets.push(players[playerID].socket);
		}
		sendGameState(sockets);
	}
}

for (var i = 0 ; i < Math.floor(Math.random()*30)+10; ++i) coins.push(new Coin());

setInterval(mainLoop, 1000/60);
