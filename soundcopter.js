sp = getSpotifyApi(1);

exports.init = init;

var game = sp.require("game");
var constants = sp.require("constants");

function init(width) {
    console.log("Soundcopter loading!");
    constants.WIDTH=width
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	console.log(context);
	console.log("Soundcopter creating new game!");
	game = new game.Game(context);
	console.log("Soundcopter starting new game!");
	game.run();
}
