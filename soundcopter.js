sp = getSpotifyApi(1);

exports.init = init;

var game = sp.require("game");

function init() {
    console.log("Soundcopter loaded!");
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	console.log(context);
	console.log("Soundcopter creating new game!");
	game = new game.Game(context);
	console.log("Soundcopter starting new game!");
	game.run();
}
