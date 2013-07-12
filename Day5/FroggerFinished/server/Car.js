var BackgroundTiles = require('./BackgroundTiles').BackgroundTiles;
var backgroundMap = require('./backgroundMap').backgroundMap;

var g = require('./Globals');
var players = g.players;

function Car (spawner) {
	this.i = spawner.i;
	this.j = spawner.j;
	this.dir = spawner.dir;
	this.speed = spawner.speed;
	this.untilTick = 1000/this.speed;
	this.checkHitTest();
}
Car.prototype = {
	dim : false,
	logic : function () {
		this.untilTick -= g.delta;
		if (this.untilTick < 0) {
			this.j += this.dir;
			this.untilTick += 1000/this.speed;
			this.dim = (BackgroundTiles[backgroundMap[this.i][this.j]].img != 'road.png');
			if (!this.dim) this.checkHitTest();
		}
	},
	checkHitTest : function () {
		for (var playerID in players) {
			var player = players[playerID];
			if (g.hitTest(this, player)) {
				player.die();
				break; //Since there's only a player per cell
			}
		}
	}
}

exports.Car = Car;