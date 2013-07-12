var g = require('./Globals');
var Log = require('./Log').Log;

var Connector = require('./Connector');

function LogSpawner (props) {
	for (var prop in props) this[prop] = props[prop];
	this.logs = [];
	this.untilTick = 1000/this.speed;
}
LogSpawner.prototype = {
	i : 0,
	j : 0,
	dir : 1,
	speed : 1,
	prob : 0.4,
	spawns : function () {
		return (Math.random() < this.prob);
	},
	spawnLog : function () {
		var log = new Log (this);
		this.logs.push(log);
		Connector.sendSpawn(this, 'log');
	},
	logic : function () {
		this.untilTick -= g.delta;
		if (this.untilTick < 0) {
			if (this.spawns()) this.spawnLog();
			this.untilTick += 1000/this.speed;
		}
		for (var i = 0; i < this.logs.length; ++i) this.logs[i].logic();
		for (var i = this.logs.length-1; i >= 0; --i) {
			var log = this.logs[i];
			if (log.dim) this.logs.splice(i, 1);
		}
	},
	hitTestPlayer : function (player) {
		if (player.i != this.i) return false;
		for (var i = 0; i < this.logs.length; ++i) {
			if (g.hitTest(this.logs[i], player)) return this.logs[i];
		}
		return false;
	}
}

exports.LogSpawner = LogSpawner;