var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

/*
camera.position.x = -1.1018233407389477;
camera.position.y = 0.7667102560150264;
camera.position.z = 9.867664273831625;
*/


camera.position.x = 0;
camera.position.y = 400;
camera.position.z = 800;
camera.lookAt(scene.position);


renderer.setClearColor( 0xffffff, 1 );


var scene = new THREE.Scene();
fogColor = new THREE.Color(0xffffff);

scene.background = fogColor;
//scene.fog = new THREE.Fog(fogColor, 0.0025, 20);



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
        object.userData.name = "WALKERS";
        scene.add(object);
        objects.push(object);
    });
    
});

var objects = [];

function onDocumentMouseDown( event ){
    event.preventDefault();
    var mouseX = (event.clientX / window.innerWidth)*2-1;
    var mouseY = -(event.clientY /window.innerHeight)*2+1;
    var vector = new THREE.Vector3( mouseX, mouseY, 0.5 );
    //projector.unprojectVector( vector, camera );
    
    
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( objects, true );

    geometry.computeFaceNormals();

    
    //console.log( intersects[0].point);
    console.log(intersects);
    //console.log(objects[0].userData.name);
    //console.log(objects[0].userData.name);
    //console.log(objects);

    scene.add(new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff ));
    
    
}



$('body').on('click', function(e){
    onDocumentMouseDown(e);
    //console.log(objects);
});


var animate = function () {
	requestAnimationFrame( animate );

    controls.update;
    
	/*cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;*/

	renderer.render(scene, camera);
    
    //console.log(camera.position);
    
};




animate();