var scene, camera, renderer, projector;
var windowHalfX, windowHalfY;

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

	this.generateNewItem = false;

	this.actualItem = {};
	this.actualItemMoveable = true;

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

var items = [],
	numberOfItems = 0;

/*
	Setup THREEjs
*/
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
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
document.body.appendChild(renderer.domElement);

/*
	CREATING OBJECTS
*/
var planeGeometry = new THREE.PlaneGeometry( 10, 5 ),
	planeMaterial = new THREE.MeshBasicMaterial( { color: 0xFACD95, wireframe: false } ),
	plane = new THREE.Mesh( planeGeometry, planeMaterial ),
	cubePlaceholderGeometry = new THREE.PlaneGeometry( 1, 1 ),
	cubePlaceholderMaterial = new THREE.MeshBasicMaterial( { color: 0x999999, wireframe: false } ),
	cubePlaceholder = new THREE.Mesh( cubePlaceholderGeometry, cubePlaceholderMaterial );

// helpers for imagination
var axes = new THREE.AxisHelper(5);
	axes.position = scene.position;
	scene.add(axes);

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

	generateCube();

	cubePlaceholder.position.x = cubePlaceholderGeometry.width / 2;
	cubePlaceholder.position.z = cubePlaceholderGeometry.height / 2;
	cubePlaceholder.rotation.x = degrees(-90);
	cubePlaceholder.position.y = 0.01;

	// add objects to scene
	scene.add(plane);
	scene.add(cubePlaceholder);

	// set actual item
	state.setActualItem(items[0]);
	state.setActualPlaceholder(cubePlaceholder);

	// camera settings
	camera.position.x = 10;
	camera.position.y = 10;
	camera.position.z = 15;
	camera.lookAt(scene.position);

	initGrid();
	// initGameTable();
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
	for(var y = 0; y <= 5; y++){
		for(var x = 0; x <= 10; x++){
			for(var z = 0; z <= 5; z++){
				state.table[x][y][z] = 0;
			}
		}
	}
}

/*
	GAMEFLOW - GAME LOGIC
*/
function gameflow(){
	var time = (new Date()).getTime(),
		move = true;

	state.timeDifference = time - state.lastTime;

	if(state.actualItem.position.y > (state.accuracy + state.actualItem.geometry.height / 2)){
		state.actualItem.position.y -= state.timeDifference * state.speed;
	}else{
		state.actualItem.position.y = 0 + state.actualItem.geometry.height / 2;
		state.actualItemMoveable = false;
		state.generateNewItem = true;
	}

	if(state.speed != 0.001){
		state.speed -= 0.0005;
		if(state.speed < 0.001){
			state.speed = 0.001;
		}
	}

	// console.log(state.actualItem.position.y);

	if(state.generateNewItem){
		generateNewItem();
	}

	// update lastTime
	state.lastTime = time;
}

function generateNewItem(){
	console.log('generate new item');

	generateCube();

	state.actualItemMoveable = true;
	state.generateNewItem = false;
}

function generateCube(){
	var newCubeGeometry = new THREE.CubeGeometry(1,1,1,1,1),
		newCubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, opacity: 0.2}),
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