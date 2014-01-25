var scene, camera, renderer, projector;
var windowHalfX, windowHalfY;
var scoreBox = document.getElementById('score'),
	bonusBox = document.getElementById('bonus'),
	controlBox = document.getElementById('control');

/*
	GAME STATE
	All information about game status/state should goes here
*/
var State = function(){

	// TIME management
	this.lastTime = (new Date()).getTime();
	this.timeDifference;
	this.speed = 0.001;
	this.accuracy = this.speed * 5;
	this.stop = false;
	this.score = 0;

	this.generateNewItem = false;

	this.actualItem = {};
	this.actualItemMoveable = true;
	this.actualItemPosition = { x: 9, y: 2, z: 4 };

	this.actualPlaceholder = {};

	this.table = [];

	this.setActualItem = function setActualItem(item){
		this.actualItem = item;
	}

	this.setActualPlaceholder = function setActualPlaceholder(placeholder){
		this.actualPlaceholder = placeholder;
	}
}
var state = new State();
// console.log(state);

var items = [],
	numberOfItems = 0;

/*
	Setup THREEjs
*/
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 33, 800 / 450, 0.1, 1000 );
renderer = new THREE.WebGLRenderer();
projector = new THREE.Projector();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = false;

renderer.shadowCameraNear = 3;
renderer.shadowCameraFar = camera.far;
renderer.shadowCameraFov = 50;

renderer.shadowMapBias = 0.0039;
renderer.shadowMapDarkness = 0.5;
renderer.shadowMapWidth = 1024;
renderer.shadowMapHeight = 1024;
document.getElementById('game').appendChild(renderer.domElement);

/*
	CREATING OBJECTS
*/
var geometry = new THREE.CubeGeometry(4,4,4),
	material = new THREE.MeshLambertMaterial( {color: config.cubeColor, wireframe: config.wireframe} ),
	cube = new THREE.Mesh(geometry, material),
	sphere = new THREE.SphereGeometry( 0.2, 16, 8 ),
	planeGeometry = new THREE.PlaneGeometry( 10, 5 ),
	planeMaterial = new THREE.MeshLambertMaterial( { color: 0xe0e0e0, overdraw: 0.5 } ),
	// planeMaterial = new THREE.MeshBasicMaterial( { color: 0xFACD95, wireframe: false } ),
	plane = new THREE.Mesh( planeGeometry, planeMaterial ),
	cubePlaceholderGeometry = new THREE.PlaneGeometry( 1, 1 ),
	cubePlaceholderMaterial = new THREE.MeshBasicMaterial( { color: 0x999999, wireframe: false } ),
	cubePlaceholder = new THREE.Mesh( cubePlaceholderGeometry, cubePlaceholderMaterial ),
	pointLight = new THREE.PointLight(0xffffff, 1, 100),
	pointLightCube = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xff0040})),
	pointLight2 = new THREE.PointLight(0xffffff, 1, 100),
	pointLightCube2 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x4000ff}));

// helpers for imagination
// var axes = new THREE.AxisHelper(5);
// 	axes.position = scene.position;
// 	scene.add(axes);

/*
	INITIALIZATION
*/
init();

/*
	RENDERING
*/
function render(){
	renderer.render(scene,camera);

	requestAnimationFrame(render);

	gameflow();

	stats.update();
}
render();

/*
	FUNCTIONS - INITIALIZATION
*/
function init(){
	plane.position.x = planeGeometry.width / 2;
	plane.position.z = planeGeometry.height / 2;
	plane.rotation.x = degrees(-90);

	cubePlaceholder.position.x = cubePlaceholderGeometry.width / 2;
	cubePlaceholder.position.z = cubePlaceholderGeometry.height / 2;
	cubePlaceholder.rotation.x = degrees(-90);
	cubePlaceholder.position.y = 0.01;

	pointLight.position.set(2,5,2.5);
	pointLightCube.position = pointLight.position;
	pointLight2.position.set(8,5,2.5);
	pointLightCube2.position = pointLight2.position;

	scene.position.x = 5;

	// add objects to scene
	scene.add(plane);
	scene.add(cubePlaceholder);
	scene.add(pointLight);
	// scene.add(pointLightCube);
	scene.add(pointLight2);
	// scene.add(pointLightCube2);

	// set actual item
	state.setActualItem(items[0]);
	state.setActualPlaceholder(cubePlaceholder);

	// camera settings
	camera.position.x = 5;
	camera.position.y = 10;
	camera.position.z = 15;
	camera.lookAt(scene.position);

	initGrid();
	generateCube();
	initGameTable();
}

function initGrid() {
	var geometry = new THREE.Geometry(),
		geometry2 = new THREE.Geometry(),
		material;

	material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.3 } );

	geometry.vertices.push(new THREE.Vector3(0, 0.01, 0));
	geometry.vertices.push(new THREE.Vector3(0, 0.01, 5));

	geometry2.vertices.push(new THREE.Vector3(0, 0.01, 0));
	geometry2.vertices.push(new THREE.Vector3(0, 0.01, 10));

	for(var i = 0; i <= 10; i++){
		var line = new THREE.Line( geometry, material );
		line.position.x = i;
		scene.add( line );
	}

	for(var i = 0; i <= 5; i++){
		var line2 = new THREE.Line( geometry2, material );
		line2.rotation.y = degrees(90);
		line2.position.z = i;
		scene.add( line2 );
	}
}

function initGameTable(){
	for(var x = 0; x < 10; x++){
		if(!state.table[x]) state.table[x] = [];

		for(var y = 0; y <= 5; y++){
			if(!state.table[x][y]) state.table[x][y] = [];

			for(var z = 0; z < 5; z++){
				state.table[x][y][z] = {
					exists: 0,
					id: 0
				};
			}
		}
	}
}

/*
	GAMEFLOW - GAME LOGIC
*/
function gameflow(){
	var time = (new Date()).getTime(),
		move = true,
		temp;

	state.timeDifference = time - state.lastTime;

	calculateActualPosition();

	if(!state.stop){
		if(withoutCollisions()){
			state.actualItem.position.y -= state.timeDifference * state.speed;
		}else{
			state.actualItemMoveable = false;
			markPosition();
		}

		if(state.speed != 0.001){
			state.speed -= 0.0005;
			if(state.speed < 0.001){
				state.speed = 0.001;
			}
		}
	}

	// update lastTime
	state.lastTime = time;
}

function withoutCollisions(){
	if((state.table[state.actualItemPosition.x][state.actualItemPosition.y][state.actualItemPosition.z].exists === 0) && (state.actualItem.position.y > (state.accuracy + state.actualItem.geometry.height / 2))){
		return true;
	}else{
		return false;
	}
}

function calculateActualPosition(){
	if(state.actualItemPosition.y != parseInt((state.actualItem.position.y + state.speed - 0.5),10)){
		// console.log('new state.actualItemPosition.y: ' + parseInt((state.actualItem.position.y + state.speed - 0.5),10));
	}

	state.actualItemPosition = {
		x: state.actualItem.position.x - 0.5,
		y: parseInt((state.actualItem.position.y + state.speed - 0.5),10),
		z: state.actualItem.position.z - 0.5
	}

	placeholderPositionY();
}

function markPosition(){
	var x = state.actualItemPosition.x,
		y = parseInt((state.actualItem.position.y + state.speed),10),
		z = state.actualItemPosition.z;

	state.table[x][y][z].exists = 1;
	state.table[x][y][z].id = state.actualItem.id;

	checklines(x,y,z);

	state.actualItem.position.y = y + 0.5;
	generateNewItem();
	placeholderPositionY();
	addScore(10);
}

function generateNewItem(){
	generateCube();

	state.actualItemMoveable = true;
	state.generateNewItem = false;
}

function generateCube(){
	var newCubeGeometry = new THREE.CubeGeometry(1,1,1,1,1),
		randomed = parseInt(Math.random() * colors.length),
		randomColor = colors[randomed],
		newCubeMaterial = new THREE.MeshLambertMaterial( { color: randomColor, overdraw: 0.5 } ),
		// newCubeMaterial = new THREE.MeshBasicMaterial({color: randomColor, opacity: 0.2}),
		newCube = new THREE.Mesh(newCubeGeometry, newCubeMaterial);

	newCube.position.x = newCubeGeometry.width / 2;
	newCube.position.y = newCubeGeometry.height / 2 + 5;
	newCube.position.z = newCubeGeometry.depth / 2;

	cubePlaceholder.position.x = cubePlaceholderGeometry.width / 2;
	cubePlaceholder.position.z = cubePlaceholderGeometry.height / 2;

	scene.add(newCube);

	items[numberOfItems] = newCube;

	state.speed = 0.001;
	state.actualItem = items[numberOfItems];
	numberOfItems++;
}

function placeholderPositionY(){
	var _y = 0,
		y = state.actualItemPosition.y,
		search = true;

	while(y >= 0 && search){
		if(state.table[state.actualItemPosition.x][y][state.actualItemPosition.z].exists === 1){
			_y = y + 1;
			search = false;
		}
		y--;
	}

	// console.log('_y: ' + _y);

	state.actualPlaceholder.position.y = _y + 0.01;
}

function checklines(xS,yS,zS){
	var removeLineX = removeLineZ = true,
		lineToRemoveX, lineToRemoveZ,
		elementsToRemove = [];

	// check X
	for(var x = 0; x < 10; x++){
		if(state.table[x][yS][zS].exists === 0) removeLineX = false;
	}

	// check Z
	for(var z = 0; z < 5; z++){
		if(state.table[xS][yS][z].exists === 0) removeLineZ = false;
	}

	if(removeLineZ || removeLineX){
		if(removeLineZ){
			for(var z = 0; z < 5; z++){
				elementsToRemove.push(state.table[xS][yS][z].id);
				state.table[xS][yS][z].exists = 0;
			}
			if(!removeLineX) addBonus(1);
		}
		if(removeLineX){
			for(var x = 0; x < 10; x++){
				elementsToRemove.push(state.table[x][yS][zS].id);
				state.table[x][yS][zS].exists = 0;
			}
			if(!removeLineZ) addBonus(2);
		}
		removeBlocks(elementsToRemove);

		if(removeLineZ && removeLineX) addBonus(3);
	}
}

function removeBlocks(elementsToRemove){
	var removed, e,
		numberOfRemovedElements = 0;

	for(var i = scene.children.length - 1; i >= 0; i--){
		/*	Starts from the end because blocks are add to the end of the scene.children table
			At the begining are other static elements
			Thanks to while statement loop is running only if necessary and for as short time as possible
		*/
		removed = false;
		e = 0;

		while(!removed && e < elementsToRemove.length && elementsToRemove.length > 0){
			if(scene.children[i].id === elementsToRemove[e]){
				numberOfRemovedElements++;

				// removing animation
				if(config.animateRemoving) removeBlockWithAnimation(i, numberOfRemovedElements);
				else scene.remove(scene.children[i]);

				elementsToRemove.splice(e,1);
				removed = true;
			}
			e++;
		}
	}
}

function removeBlockWithAnimation(index, delay){
	// delay = numberOfRemovedElements

	setTimeout(function(){
		scene.remove(scene.children[index]);
	}, config.animateRemovingTime*delay);
}

function addScore(value){
	state.score += value;
	scoreBox.innerHTML = state.score;
}

function addBonus(code){
	switch(code){
		case 1:
			// code 1 - 1 line bonus
			bonusBox.innerHTML = '+100 BONUS - 1 line';
			addScore(100);
			break;
		case 2:
			// code 2 - 1 long line bonus
			bonusBox.innerHTML = '+350 BONUS - 1 long lines';
			addScore(350);
			break;
		case 3:
			// code 3 - 2 lines bonus
			bonusBox.innerHTML = '+600 BONUS - 2 lines';
			addScore(600);
			break;
	}
	bonusBox.className = bonusBox.className + " anim-bonus";
	setTimeout(function(){
		bonusBox.className = "bonus-container score";
	}, config.bonusAnimationTime);
}

function toggleStop(){
	if(!state.stop){
		state.stop = true;
		controlBox.innerHTML = 'Play';
		bonusBox.innerHTML = '--- Pause ---';
	}else{
		state.stop = false;
		controlBox.innerHTML = 'Stop';
		bonusBox.innerHTML = 'Play!';
	}

	bonusBox.className = bonusBox.className + " anim-bonus";
	setTimeout(function(){
		bonusBox.className = "bonus-container score";
	}, config.bonusAnimationTime);
}