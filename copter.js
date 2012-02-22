exports.Copter = Copter;

var constants = sp.require("constants");

function Copter() {
	this.x = constants.COPTER_X;
	this.y = constants.COPTER_Y;
	this.new_x = this.x;
	this.new_y = this.y;
	
	this.direction = 1;
	this.acc = -1;
	
	this.img = new Image();
	
	var t = this;
	
	this.img.onload = function() {
		console.log("LOADED!");
		t.loaded = true;
	}
	this.img.src = "gfx/copter.png";
	
	var canvas = document.getElementById("canvas");
	
	canvas.addEventListener("mousedown", function() {
		t.doAcc = true;
	}, false);
	
	canvas.addEventListener("mouseup", function() {
		t.doAcc = false;
	}, false);
	
	document.addEventListener("keydown", function(e) {
//		console.log("keydown");
		t.doAcc = true;
	}, false);
	
	document.addEventListener("keyup", function(e) {
		t.doAcc = false;
	}, false);
	
}

Copter.prototype.reset = function(){
	this.x = constants.COPTER_X;
	this.y = constants.COPTER_Y;
}

Copter.prototype.moveTo = function(x, y) {
	this.new_x = x;
	this.new_y = y;
}

Copter.prototype.getHeight = function() {
	console.log("copter.getHeight is depricated. Use getLowerHeight instead");
	return constants.HEIGHT - this.y - 56;
}
Copter.prototype.getLowerHeight = function() {
	return constants.HEIGHT - this.y - 56;
}

Copter.prototype.getUpperHeight = function() {
	return constants.HEIGHT - this.y - 12;
}

Copter.prototype.update = function() {
	if(this.doAcc) {
		this.acc -= 0.1;
		if(this.acc<-constants.COPTER_MAXSPEED_Y) this.acc = -constants.COPTER_MAXSPEED_Y;
	} else {
		this.acc += 0.1;
		if(this.acc>constants.COPTER_MAXSPEED_Y) this.acc = constants.COPTER_MAXSPEED_Y;
	}
	this.y += this.acc * 4;
}

Copter.prototype.render = function(context) {
	context.drawImage(this.img, this.x, this.y, 64, 64);
}
