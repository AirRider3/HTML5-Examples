var BackgroundTiles = require('./BackgroundTiles').BackgroundTiles;
var backgroundMap = require('./backgroundMap').backgroundMap;

var g = require('./Globals');
var players = g.players;
var carSpawners = g.carSpawners;
var logSpawners = g.logSpawners;
var lilypads = g.lilypads;

var Connector = require('./Connector');

var spawnRow = backgroundMap.length-2;

function Player (socket) {
	this.socket = socket;
	this.id = socket.id;
	players[this.id] = this;
	this.randomSpawnPosition();
}
Player.prototype = {
	logic : function (move) {

		var oldPosition = {i:this.i, j:this.j};

		/*
		if (keyboard.keysCHAR['W'] && !oldKeysCHAR['W']) this.i -= 1;
		if (keyboard.keysCHAR['S'] && !oldKeysCHAR['S']) this.i += 1;
		if (keyboard.keysCHAR['D'] && !oldKeysCHAR['D']) this.j += 1;
		if (keyboard.keysCHAR['A'] && !oldKeysCHAR['A']) this.j -= 1;
		*/

		if (move) {
			//Should check if the move is valid
			this.i += move.i;
			this.j += move.j;
		}

		var tile = BackgroundTiles[backgroundMap[this.i][this.j]];
		if (!tile.walkable) {
			if(this.j == oldPosition.j) {
				//Got dragged by a log
				this.die();
			} else {
				this.i = oldPosition.i;
				this.j = oldPosition.j;
			}
		} else if (this.i != oldPosition.i || this.j != oldPosition.j) {
			if (this.hitTestOtherPlayer()) {
				this.i = oldPosition.i;
				this.j = oldPosition.j;
			} else if (tile.img == 'water.png'){
				var lily = this.hitTestLilys();
				if (lily) {
					if (lily.gotten) {
						this.i = oldPosition.i;
						this.j = oldPosition.j;
					} else {
						lily.getLily();
						this.die();
					}
				} else if (!this.hitTestLogs()) this.die();
			} else if (this.hitTestCars()) {
				this.die();
			}
		}
	},
	randomSpawnPosition : function () {
		this.j = Math.floor(Math.random()*(backgroundMap[0].length-2))+1;
		this.i = spawnRow;
		if (this.hitTestOtherPlayer()) this.randomSpawnPosition();
		else Connector.playerUpdate(this);
	},
	hitTestOtherPlayer : function () {
		for (var playerID in players) {
			if (playerID != this.id) {
				var player = players[playerID];
				if (g.hitTest(this, player)) return player;
			}
		}
		return false;
	},
	hitTestCars : function () {
		for (var i = 0; i < carSpawners.length; ++i) {
			if (carSpawners[i].hitTestPlayer(this)) return true;
		}
		return false;
	},
	hitTestLogs : function () {
		for (var i = 0; i < logSpawners.length; ++i) {
			if (logSpawners[i].hitTestPlayer(this)) return true;
		}
		return false;
	},
	hitTestLilys : function () {
		for (var i = 0; i < lilypads.length; ++i) {
			if (g.hitTest(this, lilypads[i])) return lilypads[i];
		}
		return false;
	},
	die : function () {
		this.randomSpawnPosition();
	},
	packet : function () {
		var p = {};
		p.i = this.i;
		p.j = this.j;
		p.id = this.id;
		return p;
	}
}

exports.Player = Player;