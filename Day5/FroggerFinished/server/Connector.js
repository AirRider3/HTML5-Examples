var g = require('./Globals');
var players = g.players;
var carSpawners = g.carSpawners;
var logSpawners = g.logSpawners;
var lilypads = g.lilypads;

var Player = require('./Player').Player;

var io = require('socket.io').listen(8000);
io.set('log level', 1);
io.sockets.on('connection', function (socket) {

	socket.emit('playerID', socket.id);

	var p = new Player (socket);

	socket.on('playerMove', function (move) {
		var player = players[socket.id];
		player.logic(move);
		playerUpdate(player);
	});

});

function playerUpdate (player) {
	var packet = player.packet();
	for (var playerID in players) {
		players[playerID].socket.emit('playerUpdate', packet);
	}
}
exports.playerUpdate = playerUpdate;

function sendSpawn (spawner, type) {
	for (var playerID in players) {
		players[playerID].socket.emit('spawnUpdate', {i:spawner.i, j:spawner.j});
	}
}
exports.sendSpawn = sendSpawn;