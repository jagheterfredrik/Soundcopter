var sp = getSpotifyApi(1);

var constants = sp.require("constants");

exports.Close = Close;

var ratio = 4.78;

function Close() {
	this.x = 0;
	this.y = 0;
	this.width = constants.CLOSE_FINAL_WIDTH;
	this.img = new Image();
	this.img.src = 'gfx/close.png';
}

Close.prototype.show = function(x,y) {
	this.x = x;
	this.y = y;
	this.width = 10;
	this.height = this.width / ratio;
}

Close.prototype.showing = function() {
	return this.width < constants.CLOSE_FINAL_WIDTH;
}

Close.prototype.update = function() {
	if(this.showing()) {
		this.width += constants.CLOSE_STEP_WIDTH;
		this.height = this.width / ratio;
		this.x -= constants.CLOSE_STEP_WIDTH / 2;
	}
}

Close.prototype.render = function(context) {
	if(this.showing())
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
}