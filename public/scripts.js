var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 2;

renderer.setClearColor( 0xffffff, 1 );


var controls  = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.campingFactor = 0.25;
controls.enableZoom = true;

/*
var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
*/

var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
scene.add( light );

/*var objLoader = new THREE.OBJLoader();
objLoader.setPath('models/');
objLoader.load('WALKERS.obj', function(object){
    //object.position.y -= 60;
    scene.add(object);
});*/

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setResourcePath('models/');
mtlLoader.setPath('models/');
mtlLoader.load('WALKERS.mtl', function (materials) {
    materials.preload();
    
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('models/');
    objLoader.load('WALKERS.obj', function(object){
        //object.position.y -= 60;
        scene.add(object);
    });
    
});
var animate = function () {
	requestAnimationFrame( animate );

    controls.update;
    
	/*cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;*/

	renderer.render(scene, camera);
};

animate();