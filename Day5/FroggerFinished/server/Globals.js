exports.players = {};
exports.carSpawners = [];
exports.logSpawners = [];
exports.lilypads = [];
exports.delta = 0;
exports.hitTest = function (obj1, obj2) {
	return (obj1.i == obj2.i && obj1.j == obj2.j);
};