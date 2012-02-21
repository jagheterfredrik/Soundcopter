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
	this.upperDB = 0;
	
	this.offset = 0;
	
	this.volume = 0;
	
	this.amplitude = 1;
	
	console.log("adding event handler");
	
	var t = this;
	spectrum.init(function(s) {
		var data = spectrum.normalize(s, 100);
//		console.log(data);
		
		var sum = 0;
		for(var i=0; i<data.spectruml.length; ++i) {
			sum += data.spectruml[i];
		}
		t.volume = sum;
		
		var currentValue = t.lastDB;
		var nextValue = 200+2000*data.wavel[4];
		var down = nextValue < currentValue;
		var change = Math.min(Math.abs(nextValue - currentValue),5+t.difficulty);
		t.lastDB = currentValue + (down?-change:change);
		t.lastDB = Math.min(t.lastDB,115);
//		console.log(t.lastDB);
	}, bands);
}

World.prototype.update = function() {
	this.fetchValues();
}

World.prototype.setDifficulty = function(difficulty) {

	this.difficulty = difficulty;
}

World.prototype.render = function(context) {
	var dx = constants.WIDTH/constants.STEPS;
	var frequency = Math.PI/constants.STEPS;
	++this.offset;
	for(var i = 0; i<constants.STEPS; ++i) {
		var j = i+this.offset%constants.STEPS*2;
		red   = Math.floor(Math.sin(frequency*j + 0) * 127 + 128);
		green = Math.floor(Math.sin(frequency*j + 2) * 127 + 128);
		blue  = Math.floor(Math.sin(frequency*j + 4) * 127 + 128);

		red -= 50;
		green -= 50;
		blue -= 50;
		
		red += Math.floor(255*(this.volume-300)/500);
		green += Math.floor(255*(this.volume-300)/500);
		blue += Math.floor(255*(this.volume-300)/500);
		
		context.fillStyle = "rgb("+red+","+green+","+blue+")";
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
	var newLower = new box.Box(constants.HEIGHT - this.lastDB - 350+this.difficulty);//Math.floor(150*Math.random()));
	delete this.upper.shift();
	delete this.lower.shift();
	this.upper.push(newUpper);
	this.lower.push(newLower);
	
//	console.log("lower len: "+this.lower.length);
}

