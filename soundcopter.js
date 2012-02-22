var sp = getSpotifyApi(1);

exports.init = init;

var game = sp.require("game");
var constants = sp.require("constants");

var models = sp.require('sp://import/scripts/api/models');

function resize() {
	constants.WIDTH=window.innerWidth;
}

function init() {
    console.log("Soundcopter loading!");
	window.addEventListener( 'resize', resize(), false );

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	console.log("Soundcopter creating new game!");
	gameInstance = new game.Game(context);
	console.log("Soundcopter starting new game!");

	$("#info").hide();

	models.player.play(models.player.track);
	gameInstance.run();
}
