var BackgroundTileProperties = require('./BackgroundTileProperties').BackgroundTileProperties;

var BackgroundTiles = [];
BackgroundTiles.push( new BackgroundTileProperties({img:'grass.png'}) );
BackgroundTiles.push( new BackgroundTileProperties({img:'water.png', fatal:true}) );
BackgroundTiles.push( new BackgroundTileProperties({img:'road.png'}) );
BackgroundTiles.push( new BackgroundTileProperties({img:'grass.png', walkable : false}) );

exports.BackgroundTiles = BackgroundTiles;