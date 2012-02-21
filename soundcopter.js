sp = getSpotifyApi(1);

exports.init = init;

var game = sp.require("game");

function init() {
    console.log("Soundcopter loaded!");
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	console.log(context);
	
	game = new game.Game(context);
	game.run();
}
