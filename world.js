exports.World = World

var sp = getSpotifyApi(1);
var constants = sp.require("constants");
var box = sp.require("box");
var spectrum = sp.require('spectrum');
var bands = spectrum.BAND10;
var obstacle = sp.require('obstacle')

function World() {
	this.upper = new Array();
	this.lower = new Array();	
	this.lastSounds = new Array();
	this.lastSum = 0;

	for(var i = 0; i < 25; ++i) {
		this.lastSounds.push(0);
	}
	this.obstacles = new Array();
	for(var i = 0; i<constants.STEPS; ++i) {
		this.upper[i] = new box.Box(5);
		this.lower[i] = new box.Box(5);
		if (i % 50 == 0){
			this.obstacles[i] = new obstacle.Obstacle(400,180);
		}
		else{
			this.obstacles[i] = new obstacle.Obstacle(0,0);	
		}
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
		
		var sum = 0;
		for(var i=0; i<data.spectruml.length; ++i) {
			sum += data.spectruml[i];
		}


		var removedVal = t.lastSounds.shift();
		t.lastSum -= removedVal;
		t.lastSounds.push(sum);
		t.lastSum += sum;


		//t.volume = t.lastSum/25;
		var mapGeneratorValue = sum*sum/3000;
		var lightningEffectValue = sum*sum/600;
		
		t.volume = lightningEffectValue;

		var currentValue = t.lastDB;
		var nextValue = mapGeneratorValue;
		var down = nextValue < currentValue;
		var change = Math.min(Math.abs(nextValue - currentValue),10+t.difficulty);
		t.lastDB = currentValue + (down?-change:change);
		t.lastDB = Math.min(t.lastDB,130);
//		console.log(t.lastDB);
	}, bands);
}

World.prototype.update = function() {
	this.fetchValues();
}

World.prototype.reset = function() {
	this.upper = new Array();
	this.lower = new Array();
	this.lastDB = 0;
	this.upperDB = 0;
	this.offset = 0;
	this.volume = 0;
	this.amplitude = 1;
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
		if ((i % 50) == 0){
			context.fillRect(dx*i,180,5,5)	
		}
		
		//context.fillRect(x,y,size_x,size_y)
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
	var usedValue = this.lastDB;
	console.log(usedValue);
	var newLower = new box.Box(usedValue);//Math.floor(150*Math.random()));
	var newUpper = new box.Box(constants.HEIGHT - usedValue - 350+this.difficulty);//Math.floor(150*Math.random()));
	delete this.upper.shift();
	delete this.lower.shift();
	this.upper.push(newUpper);
	this.lower.push(newLower);
	
//	console.log("lower len: "+this.lower.length);
}

