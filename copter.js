exports.Copter = Copter;

constants = sp.require("constants");

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

Copter.prototype.update = function() {
	this.x += 10;
	this.x %= constants.WIDTH;
	this.y = 45+85*Math.sin(this.x/50);
}

Copter.prototype.render = function(context) {
//	console.log("render called");
	context.drawImage(this.img, this.x, this.y, 64, 64);
}