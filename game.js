exports.Game = Game;

var constants = sp.require("constants");
var copter = sp.require("copter");
var world = sp.require("world");

function Game(context) {
	this.context = context;
	this.copter = new copter.Copter();
	this.world = new world.World();
}

Game.prototype.run = function() {
	var t = this;
	this.timer = window.setInterval(function() { t.update(); t.render(); }, 10);
}

Game.prototype.update = function() {
	this.world.update();
	this.copter.update();
}

Game.prototype.render = function() {
	this.context.clearRect(0, 0, constants.WIDTH, constants.HEIGHT);
	this.context.fill();
	this.world.render(this.context);
	this.copter.render(this.context);
}
