exports.World = World

var sp = getSpotifyApi(1);
var constants = sp.require("constants");
var box = sp.require("box");
var spectrum = sp.require('spectrum');
var bands = spectrum.BAND10;
var obstacle = sp.require('obstacle');

function World() {
	this.upper = new Array();
	this.lower = new Array();	
	this.lastSounds = new Array();
	this.lastSum = 0;
	this.songBPM = constants.DEFAULT_BPM;
	this.obstacles = new Array();
	for(var i = 0; i<constants.STEPS; ++i) {
		this.upper[i] = new box.Box(5);
		this.lower[i] = new box.Box(5);
		this.obstacles[i] = new obstacle.Obstacle(0,false);
	}
	this.mapGeneratorValue = 0;
	this.upperDB = 0;
	this.offset = 0;
	this.lightningEffectValue = 0;
	this.amplitude = 1;
	this.sinoffset = 0;
	
	console.log("adding event handler");

	(function(t) {
		spectrum.init(function(s) {
			if(isNaN(t.mapGeneratorValue)) {
				//Some weird stuff that we have to prevent here
				console.log("It happend again!!");
				t.mapGeneratorValue = 0;
			}
		
			var data = spectrum.normalize(s, 100);
			var spectrumSum = 0;
			for(var i=0; i<data.spectruml.length; ++i) {
				spectrumSum += data.spectruml[i];
			}
			t.setMapGeneratorValue(spectrumSum);
			t.setLightningEffectValue(spectrumSum);
		}, bands);
	})(this);
}

World.prototype.setBPM = function(val) {
	console.log('BPM being changed to: ',val);
	this.songBPM = val;

	var t = this;
	this.bpmTimer = window.setInterval(function(){t.bpmTick()}, (60/(this.songBPM/constants.BPM_DIVIDER))*1000/constants.PERIOD_SLICE, false);
}

World.prototype.getBPM = function() {
	return this.songBPM;
}

World.prototype.setMapGeneratorValue = function(spectrumSum) {
	var currentValue = this.mapGeneratorValue;
	var nextValue = spectrumSum*spectrumSum/3000;
	var down = nextValue < currentValue;
	var change = Math.min(Math.abs(nextValue - currentValue),20+constants.DIFFICULTY_MULT*this.getDifficulty());
	this.mapGeneratorValue = currentValue + (down?-change:change);
//	this.mapGeneratorValue = Math.min(this.mapGeneratorValue,200);
}

World.prototype.setLightningEffectValue = function(spectrumSum) {
	this.lightningEffectValue = spectrumSum*spectrumSum/600;
}

World.prototype.bpmTick = function() {
	if(this.sinoffset == undefined) this.sinoffset = 0;
	this.sinoffset += 2*Math.PI / constants.PERIOD_SLICE;
	if(this.sinoffset > 2*Math.PI) {
		this.sinoffset -= 2*Math.PI;
		console.log("TICK");
	}
}

World.prototype.update = function() {
	this.fetchValues()
}

World.prototype.reset = function() {
	this.upper = new Array();
	this.lower = new Array();
	this.mapGeneratorValue = 0;
	this.upperDB = 0;
	this.offset = 0;
	this.lightningEffectValue = 0;
	this.amplitude = 1;
}

World.prototype.setDifficulty = function(difficulty) {
	this.difficulty = difficulty;
}

World.prototype.getDifficulty = function() {
	return this.difficulty;
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
		
		red += Math.floor(255*(this.lightningEffectValue-300)/500);
		green += Math.floor(255*(this.lightningEffectValue-300)/500);
		blue += Math.floor(255*(this.lightningEffectValue-300)/500);
		
		context.fillStyle = "rgb("+red+","+green+","+blue+")";
		context.fillRect(dx*i, 0, dx+1, this.upper[i].height);
		context.fillRect(dx*i, constants.HEIGHT-this.lower[i].height, dx+1, this.lower[i].height);
/*		if (this.obstacles[i].exist) {
			context.fillRect(dx*i,this.obstacles[i].y, this.obstacles[i].width, this.obstacles[i].height);
		}
*/
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

World.prototype.getLowerValue = function(x) {
	return x+this.getDifficulty()*constants.DIFFICULTY_MULT;
}

World.prototype.getUpperValue = function(x) {
	return constants.HEIGHT-x-constants.INITIAL_WIDTH+Math.floor(10*Math.random()-5);
}

/** 
  * Fetches new values from the map generator local variable, and
  * puts them into the world data structures, making use of
  * difficulty functions etc, etc.
  *
  */
World.prototype.fetchValues = function() {
	// use latest value of private variable
	var usedValue = this.mapGeneratorValue * 1.5 - 40;
	//console.log(usedValue);
	
	usedValue += constants.AMPLITUDE_MULT*Math.sin(this.sinoffset);// replace with song BPM

	// fetch values for lower & upper
	var newLower = new box.Box(this.getLowerValue(usedValue));
	var newUpper = new box.Box(this.getUpperValue(usedValue));

	// update values
	delete this.upper.shift();
	delete this.lower.shift();
	delete this.obstacles.shift();
	this.upper.push(newUpper);
	this.lower.push(newLower);
//	this.obstacles.push(newObstacle);
	
//	console.log("lower len: "+this.lower.length);
}

