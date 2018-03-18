import './jquery-1.7.1.min'
import soundcopter from './soundcopter'

import './app.css';

function playGame(){
	document.removeEventListener("keydown", playGame, false);
	soundcopter.init(setup);
}
function setup() {
	document.addEventListener("keydown", playGame, false);
}
setup();
