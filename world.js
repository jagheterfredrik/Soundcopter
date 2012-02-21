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
		var newDB = s.data.spectruml[48];
		if (Math.abs(t.lastDB - newDB) > 17) {
			console.log("BEAT!");
		}
		t.lastDB = newDB;
	});
}

World.prototype.update = function() {
	this.fetchValues();
}

World.prototype.render = function(context) {
	var dx = constants.WIDTH/constants.STEPS;
	for(var i = 0; i<constants.STEPS; ++i) {
		context.rect(dx*i,0,dx,this.upper[i].height);
		context.rect(dx*i,constants.HEIGHT-this.upper[i].height,dx,this.upper[i].height);
		context.fillStyle = "#000000";
	}
	context.fill();
}

World.prototype.fetchValues = function() {
	console.log('called fetchValues');
	var newUpper = new box.Box(Math.floor(150*Math.random()));
	var newLower = new box.Box(Math.floor(150*Math.random()));
	this.upper.shift();
	this.lower.shift();
	this.upper.push(newUpper);
	this.lower.push(newLower);
}

