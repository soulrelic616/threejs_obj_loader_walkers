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
//camera.lookAt(scene.position);


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

/*LOADING MANAGER*/
var manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
    console.log( 'Loading complete!');
};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    
    if(itemsLoaded == itemsTotal){
        console.log('All items loaded!!!');
        repositionObj();
    }
    
};

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
};


/*LOAD MULTIOPLE MODELS*/
// Texture and OBJ loader
var index = 0;
let OBJfiles = ['AT-ACT','AT-ST','AT-AT','AT-DP','AT-AP','AT-TE','AT-DT','AT-PT','AT-RT']; 
let _MTLLoader = new THREE.MTLLoader().setPath( 'models/' );

// this function will load the next MTL and OBJ file in the queue
function loadNextMTL () {

    if (index > OBJfiles.length - 1) return;

    _MTLLoader.load( OBJfiles[index]+'.mtl', function ( materials ) {
        materials.preload();
        new THREE.OBJLoader(manager)
            .setMaterials( materials )
            .setPath( 'models/' )
            .load( OBJfiles[index]+'.obj', function ( object ) {
            
            objectName = OBJfiles[index];
            
            object.userData.name = objectName;
            //object.userData.class = "walker";
            
            scene.add(object);

            /*//reset positions
            object.position.x = 0;
            object.position.y = 0;
            object.position.z = 0;*/
            
            //then move acording to place in z vector
            //positionObjects(object, index, objectName);
            //console.log(objectName);
            
            objects.push(object);
            
            
            index++; // incrememnt count and load the next OBJ
            loadNextMTL();
            
            return objectName;

        });
        //, onProgress, onError > These can be used to keep track of the loads
    });
}

loadNextMTL (); // kick off the preloading routine

/*REPOSITION OBJECTS*/
function repositionObj(){
    /*var objectsLength = objects.length;
    for (var i = 0; i < objectsLength; i++){
        
        var objName = objects[i].userData.name;
        
        console.log(objName); 
        
        if(objName = 'AT-ACT'){
            objects[i].position.z = -20;
        } else if(objName = 'AT-ST'){
            objects[i].position.z = -10;
        }
        
    }*/
    objects.forEach(function(index, element){
        
        var objName = index.userData.name;
        
        if(objName == 'AT-ACT'){
            //objects[numb].position.z = -20;
            index.position.z = -10;
        } else if(objName == 'AT-AT'){
            index.position.z = -5;
        } else if(objName == 'AT-DP'){
            index.position.z = 0;
        } else if(objName == 'AT-ST'){
            index.position.z = 5;
        } else if(objName == 'AT-AP'){
            index.position.z = 10;
        } else if(objName == 'AT-TE'){
            index.position.z = 15;
        }
        
        
    })
}

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

var objectName;

// mouse listener
document.addEventListener( 'click', function( event ) {

    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( objects, true );

    //console.log(intersects);
    
    if ( intersects.length > 0 ) {
        
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex(130000);
            
            objectName = INTERSECTED.parent.userData.name;
            
            console.log(objectName);
            //console.log(INTERSECTED.parent.position);

            //camera.lookAt( INTERSECTED.parent.position ); 
            
        }
        //container.style.cursor = 'pointer';
        
        //console.log(objects[0])

    } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        //container.style.cursor = 'auto';
    }
    
    

}, false );


var animate = function () {
	requestAnimationFrame( animate );

    controls.update;
    
	renderer.render(scene, camera);

};

animate();
