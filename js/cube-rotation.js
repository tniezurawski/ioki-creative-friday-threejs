// configuration
var Configuration = function(){
	// rotation
	this.angularSpeed = 0.2;
	this.isAutorotate = true;
	this.wireframe = false;
	this.step = 0.1;

	this.planeX = 0;
	this.planeY = 0;
	this.planeZ = 0;

	// timeouts
	this.autorotateTimeout;

	// visual
	this.cubeColor = '#00ffc3';
}

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
	projector = new THREE.Projector();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// objects
var geometry = new THREE.CubeGeometry(4,4,4),
	material = new THREE.MeshLambertMaterial( {color: config.cubeColor, wireframe: config.wireframe} ),
	cube = new THREE.Mesh(geometry, material),
	directionalLight = new THREE.DirectionalLight(0xffffff),
	ambientLight = new THREE.AmbientLight(0x000044),
	planeGeometry = new THREE.PlaneGeometry( 15, 15 ),
	planeMaterial = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } ),
	plane = new THREE.Mesh( planeGeometry, planeMaterial );

// set objects
cube.rotation.x = 10;
cube.position.y = 1.2;
// plane.rotation.z = degrees(-90);
plane.rotation.x = degrees(-75);
plane.rotation.z = degrees(45);
plane.position.y = -2;
// plane.position.z = -100;

directionalLight.position.set(1, 1, 1).normalize();

// add objects to scene
scene.add(cube);
scene.add(plane);
scene.add(directionalLight);
scene.add(ambientLight);

// camera settings
camera.position.z = 20;
camera.position.y = -1;

// GUI settings
var guiCubeColor = gui.addColor(config, 'cubeColor').name('Cube color'),
	guiCubeWireframe = gui.add(config, 'wireframe').name('Wireframe');

gui.add(config, 'angularSpeed', -5, 5).name('Rotation speed');
gui.add(config, 'step', 0.01, 0.3).name('Step');
// gui.add(config, 'planeX');
// gui.add(config, 'planeY');
// gui.add(config, 'planeZ');

guiCubeColor.onChange( function( colorValue  ){
  colorValue=colorValue.replace( '#','0x' );
  cube.material.color.setHex(colorValue);
});
guiCubeWireframe.onChange( function( wireframe  ){
	cube.material.wireframe = wireframe;
});

// Main renderer function
function render(){
	var time = (new Date()).getTime(),
		timeDiff = time - lastTime,
		angleChange = config.angularSpeed * timeDiff * 2 * Math.PI / 1000;

	lastTime = time;

	if(config.isAutorotate){
		// console.log('cube.rotation.y: ' + cube.rotation.y);
		cube.rotation.y += angleChange;	
	}
	// else{
	// 	// console.log('cube.rotation.y: ' + cube.rotation.y + ' targetRotation: ' + targetRotation * 0.01)
	// 	cube.rotation.y += targetRotation * 0.01;
	// }

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


function onDocumentMouseDown( event ) {
	var vector, raycaster, intersects;

	event.preventDefault();

	vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );
	raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	intersects = raycaster.intersectObjects(scene.children);

	if ( intersects.length > 0 ){
		intersects[0].object.material.color.setHex('0x111fff');
		guiCubeColor.setValue('#111fff');
		makeColorful(intersects[0]);
	}
}

function makeColorful(object){
	console.log(object);
}

function degrees(n){
	return n * Math.PI/180;
}