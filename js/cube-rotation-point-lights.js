// configuration
var Configuration = function(){
	// rotation
	this.angularSpeed = 0.2;
	this.isAutorotate = true;
	this.wireframe = false;
	this.step = 0.1;

	// timeouts
	this.autorotateTimeout;

	// visual
	this.cubeColor = '#00ffc3';
	this.camera_rotation = 0;
}

var item = function(obj, name, color){
		this.obj = obj;
		this.name = name;
		this.color = color;
	},
	objects = [];

var config = new Configuration(),
	lastTime = 0,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	targetRotation = 0,
	targetRotationOnMouseDown = 0;

// GUI
var gui = new dat.GUI();

// Stats
var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

// Setup THREEjs
var scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 ),
	renderer = new THREE.WebGLRenderer(),
	projector = new THREE.Projector(),
	clock = new THREE.Clock();

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

// objects
var geometry = new THREE.CubeGeometry(4,4,4),
	material = new THREE.MeshLambertMaterial( {color: config.cubeColor, wireframe: config.wireframe} ),
	cube = new THREE.Mesh(geometry, material),
	sphere = new THREE.SphereGeometry( 0.2, 16, 8 ),
	pointLight = new THREE.PointLight(0xff0040, 1.5, 100),
	pointLightCube = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xff0040})),
	pointLight2 = new THREE.PointLight(0x4000ff, 1.5, 100),
	pointLightCube2 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x4000ff})),
	pointLight3 = new THREE.PointLight(0xd9cf37, 1.5, 100),
	pointLightCube3 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xd9cf37})),
	planeGeometry = new THREE.PlaneGeometry( 25, 25 ),
	planeMaterial = new THREE.MeshLambertMaterial( { color: 0xe0e0e0, overdraw: 0.5 } ),
	plane = new THREE.Mesh( planeGeometry, planeMaterial );

// add objects to OBJECTS_ARRAY
objects.push(
	new item(cube, 'cube', config.cubeColor),
	new item(plane, 'plane', '#e0e0e0')
);

// set objects
cube.rotation.x = 10;
cube.position.y = 1.5;
plane.rotation.x = degrees(-75);
plane.rotation.z = degrees(45);
plane.position.y = -2;
plane.position.z = -2;

pointLight.position.set(4,2,2);
pointLight2.position.set(4,1,2);
pointLight3.position.set(0,5,7);

pointLightCube.position = pointLight.position;
pointLightCube2.position = pointLight2.position;
pointLightCube3.position = pointLight3.position;

// add objects to scene
scene.add(cube);
scene.add(plane);
scene.add(pointLight);
scene.add(pointLightCube);
scene.add(pointLight2);
scene.add(pointLightCube2);
scene.add(pointLight3);
scene.add(pointLightCube3);

// camera settings
camera.position.z = 30;
camera.position.y = -1;
camera.lookAt(scene.position);

// GUI settings
var guiCubeColor = gui.addColor(config, 'cubeColor').name('Cube color'),
	guiCubeWireframe = gui.add(config, 'wireframe').name('Wireframe');

gui.add(config, 'angularSpeed', -5, 5).name('Rotation speed');
gui.add(config, 'step', 0.01, 0.3).name('Step');

guiCubeColor.onChange( function( colorValue  ){
	objects[0].color = colorValue;
  	cube.material.color.setHex(hashToHex(colorValue));
});
guiCubeWireframe.onChange( function( wireframe  ){
	cube.material.wireframe = wireframe;
});

// Main renderer function
function render(){
	var time = (new Date()).getTime(),
		timeDiff = time - lastTime,
		angleChange = config.angularSpeed * timeDiff * 2 * Math.PI / 1000,
		lightTime = time * 0.005;

	lastTime = time;

	if(config.isAutorotate){
		cube.rotation.y += angleChange;
	}

	pointLight.position.x = Math.sin( lightTime * 0.7 ) * 5;
	// pointLight.position.y = Math.cos( lightTime * 0.7 ) * 5;
	pointLight.position.z = Math.cos( lightTime * 0.7 ) * 5;

	pointLight2.position.x = Math.sin( lightTime * 0.7 ) * -5;
	// pointLight2.position.y = Math.cos( lightTime * 0.7 ) * 5;
	pointLight2.position.z = Math.cos( lightTime * 0.7 ) * -5;

	pointLight3.position.x = Math.sin( lightTime * 0.7 ) * -5;
	pointLight3.position.y = Math.cos( lightTime * 0.5 ) * -8;
	pointLight3.position.z = Math.sin( lightTime * 0.5 ) * -8;

	renderer.render(scene,camera);

	requestAnimationFrame(render);

	stats.update();
}
render();

document.addEventListener( 'mousedown', onDocumentMouseDown, false );

// other functions
function stopAutorotate(){
	config.isAutorotate = false;
	clearTimeout(config.autorotateTimeout);
	config.autorotateTimeout = setTimeout(function(){
		startAutoratate();
	},1000);
}

function startAutoratate(){
	config.isAutorotate = true;
}

function onDocumentMouseDown( event ) {
	var vector, raycaster, intersects;

	event.preventDefault();

	vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );
	raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	intersects = raycaster.intersectObjects(scene.children);

	if ( intersects.length > 0 ){
		selectObjectOnScreen(intersects[0], '5e66eb');
	}else{
		clearSelection();
	}
}

function selectObjectOnScreen(intersect, color){
	clearSelection();
	intersect.object.material.color.setHex('0x' + color);
}

function clearSelection(){
	for(var i = 0, length = objects.length; i < length; i++){
		objects[i].obj.material.color.setHex(hashToHex(objects[i].color));
	}
}

function cameraRotation(direction){
	var x, y, z;

	if(direction == 'left'){
		config.camera_rotation += config.step;
	}else{
		config.camera_rotation -= config.step;
	}

	x = 20 * Math.sin(config.camera_rotation);
	z = 20 * Math.cos(config.camera_rotation);

    camera.position.x = x;
    camera.position.z = z;
    camera.lookAt(scene.position);
}

function degrees(n){
	return n * Math.PI/180;
}

function hexToHash(hex){
	var hash = hex.replace( '0x','#' );
	return hash;
}

function hashToHex(hash){
	var hex = hash.replace( '#','0x' );
	return hex;
}

// keypress
keypress.combo("w", function() {
    cube.rotation.x -= config.step;
    stopAutorotate();
});

keypress.combo("s", function() {
    cube.rotation.x += config.step;
   	stopAutorotate();
});

keypress.combo("a", function() {
    cube.rotation.y += config.step;
    stopAutorotate();
});

keypress.combo("d", function() {
    cube.rotation.y -= config.step;
    stopAutorotate();
});

keypress.combo("z", function() {
	cameraRotation('left');
});

keypress.combo("c", function() {
	cameraRotation('right');
});