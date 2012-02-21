exports.Game = Game;

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
	this.context.clearRect(0, 0, canvas.width, canvas.height);
	this.world.render(this.context);
	this.copter.render(this.context);
}