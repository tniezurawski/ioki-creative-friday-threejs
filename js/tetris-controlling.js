keypress.combo("up", function() { goUp(); });
keypress.combo("w", function() { goUp(); });

keypress.combo("down", function() { goDown(); });
keypress.combo("s", function() { goDown(); });

keypress.combo("left", function() { goLeft(); });
keypress.combo("a", function() { goLeft(); });

keypress.combo("right", function() { goRight(); });
keypress.combo("d", function() { goRight(); });

keypress.combo("p", function(){
	toggleStop();
});

keypress.combo("space", function() {
	state.speed += 0.004;
	addScore(1);
});

function goUp(){
	if(state.actualItem.position.z >= (1 + state.actualItem.geometry.depth / 2) && state.actualItemMoveable){
		if(state.table[state.actualItemPosition.x][state.actualItemPosition.y][state.actualItemPosition.z  - 1].exists === 0){
	    	placeholderPositionY();
	    	state.actualItem.position.z -= config.step;
	    	state.actualPlaceholder.position.z -= config.step;
	    }
	}
}

function goDown(){
	if(state.actualItem.position.z <= (4 - state.actualItem.geometry.depth / 2) && state.actualItemMoveable){
		if(state.table[state.actualItemPosition.x][state.actualItemPosition.y][state.actualItemPosition.z  + 1].exists === 0){
	    	placeholderPositionY();
	    	state.actualItem.position.z += config.step;
	    	state.actualPlaceholder.position.z += config.step;
	    }
	}
}

function goLeft(){
	if(state.actualItem.position.x >= (1 + state.actualItem.geometry.width / 2) && state.actualItemMoveable){
		if(state.table[state.actualItemPosition.x - 1][state.actualItemPosition.y][state.actualItemPosition.z].exists === 0){
			placeholderPositionY();
		    state.actualItem.position.x -= config.step;
		    state.actualPlaceholder.position.x -= config.step;
		}
	}
}

function goRight(){
	if(state.actualItem.position.x <= (9 - state.actualItem.geometry.width / 2) && state.actualItemMoveable){
		if(state.table[state.actualItemPosition.x + 1][state.actualItemPosition.y][state.actualItemPosition.z].exists === 0){
		    placeholderPositionY();
		    state.actualItem.position.x += config.step;
		    state.actualPlaceholder.position.x += config.step;
		}
	}
}