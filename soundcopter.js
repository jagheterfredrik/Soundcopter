var sp = getSpotifyApi(1);

exports.init = init;

var game = sp.require("game");
var constants = sp.require("constants");

var models = sp.require('sp://import/scripts/api/models');

function resize() {
	constants.WIDTH=window.innerWidth;
}

var cb, track;

function showInfo() {
	cb();
}

function init(callback) {
    console.log("Soundcopter loading!");
	cb = callback;
	window.addEventListener( 'resize', resize(), false );

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	console.log(context, showInfo);
	console.log("Soundcopter creating new game!");
	gameInstance = new game.Game(context);
	console.log("Soundcopter starting new game!");
	
	var info = document.getElementById("info");
	info.style.display = 'none';

	models.player.play(models.player.track);
	gameInstance.run();
}
