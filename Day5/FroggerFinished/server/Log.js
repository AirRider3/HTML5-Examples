var BackgroundTiles = require('./BackgroundTiles').BackgroundTiles;
var backgroundMap = require('./backgroundMap').backgroundMap;

var g = require('./Globals');
var players = g.players;

var Connector = require('./Connector');

function Log (spawner) {
	this.i = spawner.i;
	this.j = spawner.j;
	this.dir = spawner.dir;
	this.speed = spawner.speed;
	this.untilTick = 1000/this.speed;
}
Log.prototype = {
	dim : false,
	logic : function () {
		this.untilTick -= g.delta;
		if (this.untilTick < 0) {
			if (!this.dim) this.checkHitTest();
			this.j += this.dir;
			this.untilTick += 1000/this.speed;
			this.dim = (BackgroundTiles[backgroundMap[this.i][this.j]].img != 'water.png');
		}
	},
	checkHitTest : function () {
		for (var playerID in players) {
			var player = players[playerID];
			if (g.hitTest(this, player)) {
				player.j += this.dir;
				Connector.playerUpdate(player);
				break; //Since there's only a player per cell
			}
		}
	}
}

exports.Log = Log;