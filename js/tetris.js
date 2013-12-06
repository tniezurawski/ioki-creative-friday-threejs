var scene, camera, renderer, projector;
var windowHalfX, windowHalfY;

var State = function(){

}

// Setup THREEjs
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

// objects
var planeGeometry = new THREE.PlaneGeometry( 4, 2 ),
	planeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } ),
	plane = new THREE.Mesh( planeGeometry, planeMaterial )
	cubeGeometry = new THREE.CubeGeometry(1,1,1,1,1),
	cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00}),
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// // set objects
plane.position.x = planeGeometry.width / 2;
plane.position.z = planeGeometry.height / 2;
plane.rotation.x = degrees(-90);

cube.position.x = cubeGeometry.width / 2;
cube.position.y = cubeGeometry.height / 2;
cube.position.z = cubeGeometry.depth / 2;

// add objects to scene
scene.add(cube);
scene.add(plane);

// camera settings
camera.position.x = 5;
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(scene.position);

initGrid();

var axes = new THREE.AxisHelper(5);
	axes.position = scene.position;
	scene.add(axes);

// Main renderer function
function render(){
	renderer.render(scene,camera);

	requestAnimationFrame(render);

	stats.update();
}
render();

function initGrid() {
	var geometry = new THREE.Geometry(),
		material;

	material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(new THREE.Vector3(0, 0, 6));

	for(var i = 0; i <= 6; i++){
		var line = new THREE.Line( geometry, material );
		line.position.x = i;
		scene.add( line );

		var line = new THREE.Line( geometry, material );
		line.rotation.y = degrees(90);
		line.position.z = i;
		scene.add( line );
	}
}

// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
// document.addEventListener( 'touchmove', onDocumentTouchMove, false );

// keypress
// keypress.combo("w", function() {
//     cube.rotation.x -= config.step;
//     stopAutorotate();
// });

// keypress.combo("s", function() {
//     cube.rotation.x += config.step;
//    	stopAutorotate();
// });

// keypress.combo("a", function() {
//     cube.rotation.y += config.step;
//     stopAutorotate();
// });

// keypress.combo("d", function() {
//     cube.rotation.y -= config.step;
//     stopAutorotate();
// });

// keypress.combo("z", function() {
// 	cameraRotation('left');
// });

// keypress.combo("c", function() {
// 	cameraRotation('right');
// });