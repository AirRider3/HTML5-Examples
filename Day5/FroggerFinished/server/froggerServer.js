"use strict";

var BackgroundTiles = require('./BackgroundTiles').BackgroundTiles;
var backgroundMap = require('./backgroundMap').backgroundMap;

var g = require('./Globals');

var Connector = require('./Connector');

var Log = require('./Log').Log;

var LogSpawner = require('./LogSpawner').LogSpawner;

var Car = require('./Car').Car;

var CarSpawner = require('./CarSpawner').CarSpawner;

var LilyPad = require('./LilyPad').LilyPad;

var Player = require('./Player').Player;

var players = g.players;
var carSpawners = g.carSpawners;
var logSpawners = g.logSpawners;
var lilypads = g.lilypads;

function init() {

	carSpawners.push(new CarSpawner({i:6,j:1, speed: 3}));
	carSpawners.push(new CarSpawner({i:7,j:10, dir: -1, speed: 2}));
	carSpawners.push(new CarSpawner({i:8,j:1, speed: 3}));

	logSpawners.push(new LogSpawner({i:2, j:10, speed: 1, dir:-1}));
	logSpawners.push(new LogSpawner({i:3, j:1, speed: 1}));
	logSpawners.push(new LogSpawner({i:4, j:10, speed: 1, dir:-1}));
	logSpawners.push(new LogSpawner({i:5, j:1, speed: 1}));
	
	lilypads.push(new LilyPad({i:1,j:2}));
	lilypads.push(new LilyPad({i:1,j:4}));
	lilypads.push(new LilyPad({i:1,j:7}));
	lilypads.push(new LilyPad({i:1,j:9}));

}

var oldDate = +new Date();

function mainLoop () {
	var currentDate = +new Date();
	g.delta = currentDate - oldDate;
	oldDate = currentDate;

	for (var playerID in players) {
		var player = players[playerID];
		if (player.socket.disconnected) delete players[playerID];
		else players[playerID].logic();
	}
	for (var i = 0; i < carSpawners.length; ++i) {
		carSpawners[i].logic();
	}
	for (var i = 0; i < logSpawners.length; ++i) logSpawners[i].logic();
}



init();

setInterval(mainLoop, 1000/30);