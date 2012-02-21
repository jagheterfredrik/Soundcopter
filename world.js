
exports.World = World

constants = sp.require("constants");
box = sp.require("box");

function World() {
	this.upper = new Array();
	this.lower = new Array();
	for(var i = 0; i<constants.STEPS; ++i) {
		this.upper[i] = new box.Box(5);
		this.lower[i] = new box.Box(5);
	}
}

World.prototype.update = function() {
	for(var i = 0; i<STEPS; ++i) {
		this.upper[i].update();
		this.lower[i].update();
	}
}

World.prototype.render = function(context) {
	console.log("render world");
	for(var i = 0; i<constants.STEPS; ++i) {
		this.upper[i].render(context);
		this.lower[i].render(context);
	}
}