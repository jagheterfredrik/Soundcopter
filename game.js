exports.Game = Game;

var sp = getSpotifyApi(1);

var constants = sp.require("constants");
var copter = sp.require("copter");
var world = sp.require("world");
var close = sp.require("close");

var models = sp.require('sp://import/scripts/api/models');

function Game(context) {
	this.context = context;
	this.copter = new copter.Copter();
	this.world = new world.World();
	
	this.close = new close.Close();
	
	var t = this;
	models.player.observe(models.EVENT.CHANGE, function(event) {
		if(event.data.curtrack) {
			t.newSong(models.player.track.artists[0].name.decodeForText(), models.player.track.name.decodeForText());
		}
	});
	
	t.newSong(models.player.track.artists[0].name.decodeForText(), models.player.track.name.decodeForText());
	
	this.points = 0;
	this.lost = false;
}

Game.prototype.newSong = function(artist, title) {
	console.log("song changed to "+title +" BY "+ artist);
	var t = this;
	$.getJSON("http://developer.echonest.com/api/v4/song/search?api_key=QBELDDBA04HW6PHU3&artist="+artist+"&title="+title, function(data) {
		if(data.response.songs.length == 0) {
			console.log("No sound data available");
			t.world.setBPM(120);
			//set default value in world
		} else {
			$.getJSON("http://developer.echonest.com/api/v4/song/profile?api_key=QBELDDBA04HW6PHU3&id="+data.response.songs[0].id+"&bucket=audio_summary", function(data){
				var bpm = data.response.songs[0].audio_summary.tempo;
				console.log('got bpm from echonest: ',bpm);
				//call bpm-changer in world
				t.world.setBPM(bpm);
			});
		}
	});
}

Game.prototype.run = function() {
	var t = this;
	this.timer = window.setInterval(function() { t.update(); t.render(); }, constants.GAME_UPDATE_RATE);
}

Game.prototype.pause = function() {
	window.clearInterval(this.timer);
}

Game.prototype.isRunning = function() {
	return !this.lost;
}

Game.prototype.update = function() {
	if(this.lost) return;
	
	this.world.setDifficulty(1+this.points/150)
	
	this.world.update();
	this.copter.update();
	
	this.close.update();
	
	++this.points;
	
	if(this.world.getUpperHeight(constants.COPTER_X+48) >= (constants.HEIGHT-this.copter.getUpperHeight()-20)) {
		this.close.show(this.copter.x+25, this.copter.y);
	}
	
	if(this.world.getLowerHeight(constants.COPTER_X+48) >= this.copter.getHeight()-20) {
		this.close.show(this.copter.x+25, this.copter.y+50);
	}
	
	
	if(this.world.getUpperHeight(constants.COPTER_X+48) >= (constants.HEIGHT-this.copter.getUpperHeight()) || (this.world.getLowerHeight(constants.COPTER_X+48) >= this.copter.getHeight())) {
		console.log("world height at crash "+(this.world.getUpperHeight(constants.COPTER_X+48)));
		console.log("copter height at crash "+(constants.HEIGHT-this.copter.getUpperHeight()));
		this.lost = true;

		models.player.playing = false;
		
		//alert("Game over, you scored "+this.points+" points!");
		
		var prevHighscore = localStorage.getItem(models.player.track.uri);
		if(prevHighscore === null) {
			prevHighscore = 0;
		}
		if(this.points > prevHighscore) {
			$("#prevscore").html("NEW HIGHSCORE!");
			localStorage.setItem(models.player.track.uri, this.points);
		} else {
			$("#prevscore").html("Your previous highscore is "+prevHighscore);
		}
		
		$("#crashinfo").show();
		$("#points").html(this.points);
		$("#finalscore").html(this.points+" POINTS!");
		setTimeout(function() {
			document.addEventListener("keydown", function(){window.location=window.location;}, false);
		}, 700, false);
		
		this.reset();

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
	this.close.render(this.context);
	
	$("#points").html(this.points);
}
