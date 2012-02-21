sp = getSpotifyApi(1);

exports.init = init;

var game, context;

//COPTER CLASS

function Copter() {
	this.x = 50;
	this.y = 50;
	this.new_x = this.x;
	this.new_y = this.y;
	
	this.img = new Image();
	
	var copter = this;
	
	this.img.onload = function() {
		console.log("LOADED!");
		copter.loaded = true;
	}
	this.img.src = "gfx/copter.png";
}

Copter.prototype.moveTo = function(x, y) {
	this.new_x = x;
	this.new_y = y;
}

Copter.prototype.render = function(context) {
//	console.log("render called");
	context.drawImage(this.img, this.x, this.y, 64, 64);
}

function Game(context) {
	this.context = context;
	this.copter = new Copter();
	
	var t = this;
	this.timer = window.setInterval(function() { t.render(); }, 5);
}

Game.prototype.render = function() {
	this.context.clearRect(0, 0, canvas.width, canvas.height);
	this.copter.render(this.context);
	this.copter.x += 10;
	this.copter.x %= canvas.width;
}

function init() {
    console.log("Soundcopter loaded!");
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	console.log(context);
	
	game = new Game(context);
	game.render();
}
