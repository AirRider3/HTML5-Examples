var g = require('./Globals');
var Car = require('./Car').Car;

var Connector = require('./Connector');

function CarSpawner (props) {
	for (var prop in props) this[prop] = props[prop];
	this.cars = [];
	this.untilTick = 1000/this.speed;
}
CarSpawner.prototype = {
	i : 0,
	j : 0,
	dir : 1,
	speed : 1,
	prob : 0.3,
	spawns : function () {
		return (Math.random() < this.prob);
	},
	spawnCar : function () {
		var car = new Car (this);
		this.cars.push(car);
		Connector.sendSpawn(this, 'car');
	},
	logic : function () {
		this.untilTick -= g.delta;
		if (this.untilTick < 0) {
			if (this.spawns()) this.spawnCar();
			this.untilTick += 1000/this.speed;
		}
		for (var i = this.cars.length-1; i >= 0; --i) {
			var car = this.cars[i];
			car.logic();
			if (car.dim) this.cars.splice(i, 1);
		}
	},
	hitTestPlayer : function (player) {
		if (player.i != this.i) return false;
		for (var i = 0; i < this.cars.length; ++i) {
			if (g.hitTest(this.cars[i], player)) return this.cars[i];
		}
		return false;
	}
}

exports.CarSpawner = CarSpawner;