keypress.combo("w", function() {
	if(state.actualItem.position.z >= (1 + state.actualItem.geometry.depth / 2) && state.actualItemMoveable){
    	state.actualItem.position.z -= config.step;
    	state.actualPlaceholder.position.z -= config.step;
	}
});

keypress.combo("s", function() {
	if(state.actualItem.position.z <= (4 - state.actualItem.geometry.depth / 2) && state.actualItemMoveable){
    	state.actualItem.position.z += config.step;
    	state.actualPlaceholder.position.z += config.step;
	}
});

keypress.combo("a", function() {
	if(state.actualItem.position.x >= (1 + state.actualItem.geometry.width / 2) && state.actualItemMoveable){
	    state.actualItem.position.x -= config.step;
	    state.actualPlaceholder.position.x -= config.step;
	}
});

keypress.combo("d", function() {
	if(state.actualItem.position.x <= (9 - state.actualItem.geometry.width / 2) && state.actualItemMoveable){
	    state.actualItem.position.x += config.step;
	    state.actualPlaceholder.position.x += config.step;
	}
});

keypress.combo("space", function() {
	state.speed += 0.004;
	console.log('space ' + state.speed);
});