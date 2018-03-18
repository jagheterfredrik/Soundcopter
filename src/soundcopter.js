exports.init = init;

import game from './game'
import constants from './constants'

//import models from './models'

function resize() {
	constants.WIDTH=window.innerWidth;
}

function init() {
    console.log("Soundcopter loading!");
	window.addEventListener( 'resize', resize(), false );

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	console.log("Soundcopter creating new game!");
	var gameInstance = new game.Game(context);
	console.log("Soundcopter starting new game!");

	$("#info").hide();

	//models.player.play(models.player.track);
	gameInstance.run();
}
