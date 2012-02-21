exports.World = World

var sp = getSpotifyApi(1);

var constants = sp.require("constants");
var box = sp.require("box");

var spectrum = sp.require('spectrum');

var bands = spectrum.BAND10;

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
	spectrum.init(function(s) {
		var data = spectrum.normalize(s, 100);
//		console.log(data);
		var currentValue = t.lastDB;
		var nextValue = 2*data.spectruml[4];
		var down = nextValue < currentValue;
		var change = Math.min(Math.abs(nextValue - currentValue),25);
		t.lastDB = currentValue + (down?-change:change);
	}, bands);
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

World.prototype.getUpperHeight = function(x) {
	var i = Math.floor(x/constants.WIDTH*constants.STEPS);
	return this.upper[i].height;
}

World.prototype.fetchValues = function() {
//	console.log('called fetchValues');
	var newUpper = new box.Box(this.lastDB);//Math.floor(150*Math.random()));
	var newLower = new box.Box(constants.HEIGHT - this.lastDB - 200);//Math.floor(150*Math.random()));
	delete this.upper.shift();
	delete this.lower.shift();
	this.upper.push(newUpper);
	this.lower.push(newLower);
	
//	console.log("lower len: "+this.lower.length);
}

