exports.Game = Game;

var constants = sp.require("constants");
var copter = sp.require("copter");
var world = sp.require("world");

function Game(context) {
	this.context = context;
	this.copter = new copter.Copter();
	this.world = new world.World();
	
	this.points = 0;
	
	this.lost = false;
}

Game.prototype.run = function() {
	var t = this;
	this.timer = window.setInterval(function() { t.update(); t.render(); }, 20);
}

Game.prototype.update = function() {
	if(this.lost) return;
	
	this.world.setDifficulty(1+this.points/800)
	
	this.world.update();
	this.copter.update();
	
	++this.points;
	
	if(this.world.getUpperHeight(180+48) >= (constants.HEIGHT-this.copter.getUpperHeight()) || (this.world.getLowerHeight(180+48) >= this.copter.getHeight())) {
		console.log("world height at crash "+(this.world.getUpperHeight(180+48)));
		console.log("copter height at crash "+(constants.HEIGHT-this.copter.getUpperHeight()));
		this.lost = true;
		alert("Game over, you scored "+this.points+" points!");
		var res = confirm("You ate it, keep playing?");
		if (res == true) {
			this.lost = false;
			this.copter.y = 180;
		}
	}
}
Game.prototype.reset = function() {
	//Write me!
}


Game.prototype.render = function() {
	if(this.lost) return;
	this.context.clearRect(0, 0, constants.WIDTH, constants.HEIGHT);
	this.world.render(this.context);
	this.copter.render(this.context);
	
	document.getElementById("points").innerHTML = this.points;
	
}
