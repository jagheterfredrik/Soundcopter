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
	this.timer = window.setInterval(function() { t.update(); t.render(); }, 15);
}

Game.prototype.update = function() {
	if(this.lost) return;
	
	this.world.setDifficulty(1+this.points/150)
	
	this.world.update();
	this.copter.update();
	
	++this.points;
	
	if(this.world.getUpperHeight(constants.COPTER_X+48) >= (constants.HEIGHT-this.copter.getUpperHeight()) || (this.world.getLowerHeight(constants.COPTER_X+48) >= this.copter.getHeight())) {
		console.log("world height at crash "+(this.world.getUpperHeight(constants.COPTER_X+48)));
		console.log("copter height at crash "+(constants.HEIGHT-this.copter.getUpperHeight()));
		this.lost = true;
		alert("Game over, you scored "+this.points+" points!");
//		this.reset()
		document.getElementById("play_button").innerHTML = "<input type='button' onclick='play_game()'' value='Play again!'>"
			this.lost = false;
			this.copter.y = constants.COPTER_Y;
			this.reset()
	}
}
Game.prototype.reset = function() {
	this.world.reset();
	this.copter.reset();
	this.points = 0;
	this.lost = false;
	clearInterval(this.timer);
}


Game.prototype.render = function() {
	
	if(this.lost) return;
	this.context.clearRect(0, 0, constants.WIDTH, constants.HEIGHT);
	this.world.render(this.context);
	this.copter.render(this.context);
	
	document.getElementById("points").innerHTML = this.points;
}
