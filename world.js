exports.World = World

var constants = sp.require("constants");
var box = sp.require("box");

function World() {
	this.upper = new Array();
	this.lower = new Array();
	for(var i = 0; i<constants.STEPS; ++i) {
		this.upper[i] = new box.Box(5);
		this.lower[i] = new box.Box(5);
	}
	
	this.lastDB = 0;
	
	console.log("adding event handler");
	
	var t = this;
	sp.trackPlayer.addEventListener("audioSpectrumChanged", function(s) {
//		console.log(s);
		t.lastDB = 5*s.data.spectruml[68];
	});
}

World.prototype.update = function() {
	this.fetchValues();
}

World.prototype.render = function(context) {
	var dx = constants.WIDTH/constants.STEPS;
	for(var i = 0; i<constants.STEPS; ++i) {
		context.fillRect(dx*i,0,dx,this.upper[i].height);
		context.fillRect(dx*i,constants.HEIGHT-this.lower[i].height,dx,this.lower[i].height);
	//	context.fillStyle = "#000000";
	}
}

World.prototype.getLowerHeight = function(x) {
	var i = Math.floor(x/constants.WIDTH*constants.STEPS);
	return this.lower[i].height;
}

World.prototype.fetchValues = function() {
//	console.log('called fetchValues');
	var newUpper = new box.Box(Math.floor(150*Math.random()));
	var newLower = new box.Box(Math.floor(150*Math.random()));
	delete this.upper.shift();
	delete this.lower.shift();
	this.upper.push(newUpper);
	this.lower.push(newLower);
	
//	console.log("lower len: "+this.lower.length);
}

