sp = getSpotifyApi(1);

exports.init = init;

var game = sp.require("game");
var constants = sp.require("constants");

function resize() {
	constants.WIDTH=window.innerWidth;
}

function init(width) {
    console.log("Soundcopter loading!");

	window.addEventListener( 'resize', resize(), false );

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	console.log(context);
	console.log("Soundcopter creating new game!");
	game = new game.Game(context);
	console.log("Soundcopter starting new game!");
	
	var info = document.getElementById("info");
	info.style.display = 'none';
	game.run();
}
