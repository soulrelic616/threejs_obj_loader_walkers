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


camera.position.x = 23.35238695426168;
camera.position.y = 8.717253467074778;
camera.position.z = -17.80472949084262;
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

/*LOAD AT ACT*/
mtlLoader.setResourcePath('models/at-act/');
mtlLoader.setPath('models/at-act/');
mtlLoader.load('AT-ACT.mtl', function (materials) {
    materials.preload();
    
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('models/at-act/');
    objLoader.load('AT-ACT.obj', function(object){
        //object.position.y -= 60;
        object.userData.name = "at-act";
        scene.add(object);
        objects.push(object);
    });
    
});

var objects = [];

var geometry, material, mesh, INTERSECTED;

var container = document.body;

var mouseX, MouseY, vector;


function actionFn( event ){
    event.preventDefault();
    var mouseX = (event.clientX / window.innerWidth)*2-1;
    var mouseY = -(event.clientY /window.innerHeight)*2+1;
    var vector = new THREE.Vector3( mouseX, mouseY, 0.5 );
    //projector.unprojectVector( vector, camera );
    
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    
    /*var raycaster = new THREE.Raycaster();
    
    raycaster.setFromCamera( new THREE.Vector2(), camera );  */
    
    var intersects = raycaster.intersectObjects( objects, true );
    
    //console.log( intersects[0].point);
    //console.log(intersects[0]);
    //console.log(objects[0].userData.name);
    //console.log(objects);
    
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex(130000);
            
            /*scene.add(new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff ));*/
            
        }
        container.style.cursor = 'pointer';
    } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        container.style.cursor = 'auto';
    }
    geometry.computeFaceNormals();

}

// find intersections
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// mouse listener
document.addEventListener( 'mousedown', function( event ) {

    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( objects, true );

    console.log(intersects);
    
    if ( intersects.length > 0 ) {

        //info.innerHTML = 'INTERSECT Count: ' + ++count;
        //console.log('no intersects');

    }
    
    console.log('click');

}, false );


$('body').on('mousemove', function(e){
    //actionFn(e);
    //console.log(objects); 
});


var animate = function () {
	requestAnimationFrame( animate );

    controls.update;

	renderer.render(scene, camera);
    
    //console.log(camera.position);
    
};




animate();