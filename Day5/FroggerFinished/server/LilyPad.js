var g = require('./Globals');
var lilypads = g.lilypads;

function LilyPad (props) {
	this.i = props.i;
	this.j = props.j;
	this.gotten = false;
}
LilyPad.prototype.getLily = function () {
	this.gotten = true;
	for (var i = 0; i < lilypads.length; ++i) {
		if (!lilypads[i].gotten) return;
	}
	//WIN
	console.log('GAME WAS WON HUEHUE');
}

exports.LilyPad = LilyPad;