function BackgroundTileProperties (props) {
	for (var prop in props) this[prop] = props[prop];
}
BackgroundTileProperties.prototype.fatal = false;
BackgroundTileProperties.prototype.walkable = true;

exports.BackgroundTileProperties = BackgroundTileProperties;