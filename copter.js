exports.Copter = Copter;

var constants = sp.require("constants");

function Copter() {
	this.x = 180;
	this.y = 180;
	this.new_x = this.x;
	this.new_y = this.y;
	
	this.direction = 1;
	
	this.img = new Image();
	
	var t = this;
	
	this.img.onload = function() {
		console.log("LOADED!");
		t.loaded = true;
	}
	this.img.src = "gfx/copter.png";
	
	document.getElementById("canvas").addEventListener("mousedown", function() {
		t.direction = -1;
	}, false);
	
	document.getElementById("canvas").addEventListener("mouseup", function() {
		t.direction = 1;
	}, false);
	
}

Copter.prototype.moveTo = function(x, y) {
	this.new_x = x;
	this.new_y = y;
}

Copter.prototype.getHeight = function() {
	return constants.HEIGHT - this.y - 56;
}

Copter.prototype.getUpperHeight = function() {
	return constants.HEIGHT - this.y - 12;
}

Copter.prototype.update = function() {
	this.y += this.direction * 4;
}

Copter.prototype.render = function(context) {
	context.drawImage(this.img, this.x, this.y, 64, 64);
}
