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

/*camera.position.x = 1.49267143696583;
camera.position.y = 1.1630709788456357;
camera.position.z = 1.2807783706724414;*/

/*camera.position.x = 1.5269201550550067;
camera.position.y = 1.0987784781012584;
camera.position.z = 30.928029497498436;*/

/*camera.position.x = 1.4577165903123466;
camera.position.y = 1.227688408695487;
camera.position.z = 31.201282339664896*/

camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;



//camera.lookAt(scene.position);

var camRot = 0.5235987755982987,
    newRot;

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
    /*console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );*/
};

manager.onLoad = function ( ) {
    //console.log( 'Loading complete!');
    /*camera.rotation.set(-0.7853981633974483,0.6154797086703874,0.6154797086703874);
    camera.updateProjectionMatrix(); */
};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    /*console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );*/
    
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
    objects.forEach(function(index, element){
        var objName = index.userData.name;
        if(objName == 'AT-ACT'){
            //objects[numb].position.z = -20;
            index.position.z = -40;
        } else if(objName == 'AT-AT'){
            index.position.z = -35;
        } else if(objName == 'AT-DP'){
            index.position.z = -30;
        } else if(objName == 'AT-ST'){
            index.position.z = -25;
        } else if(objName == 'AT-AP'){
            index.position.z = -20;
        } else if(objName == 'AT-TE'){
            index.position.z = -15;
        } else if(objName == 'AT-DT'){
            index.position.z = -10;
        } else if(objName == 'AT-PT'){
            index.position.z = -5;
        } else if(objName == 'AT-RT'){
            index.position.z = 0;
            //camera.lookAt(index.position);
        }
    });
}

var objects = [];
var geometry, material, mesh, INTERSECTED;
var container = document.body;
var mouseX, MouseY, vector;

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
            INTERSECTED.material.color.setHex(150000);
            
            objectName = INTERSECTED.parent.userData.name;
            
            console.log(objectName);
            //console.log(INTERSECTED.parent.position);

            //camera.lookAt( INTERSECTED.parent.position ); 
            
            var walkerModel = INTERSECTED.parent;
            
            //console.log(walkerModel);
            
            //console.error(camera.position);
            
            lookAtWalker(walkerModel);
            
        }
        //container.style.cursor = 'pointer';
        
        //console.log(objects[0])

    } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        //container.style.cursor = 'auto';
    }
    
    

}, false );


function lookAtWalker (thisWalker){
    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    
    //var from = camera.position.clone();
    
    //var from = controls.object.position;
    
    var to = {
        x: thisWalker.position.x + 4,
        y: thisWalker.position.y + 4,
        z: thisWalker.position.z + 4
    };
    
    var newX = thisWalker.position.x,
        newY = thisWalker.position.y,
        newZ = thisWalker.position.z
    
    /*console.log(from);
    console.log(to);*/
    
    //console.log(thisWalker.position)
    
    TWEEN.removeAll();    // remove previous tweens if needed
    
    var tween = new TWEEN.Tween(from)
    .to(to, 800)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function () {
        
        camera.position.set(this.x, this.y, this.z);
        
        //controls.dispose();
        
        controls.enabled = false;
        
        //camera.lookAt(this.x, this.y, this.z)
            
        //camera.lookAt(new THREE.Vector3(0, 0, 0));
        //camera.lookAt(new THREE.Vector3(newX, newY, newZ));
        
        //camera.lookAt(camera.position);
        
        //controls.update();
        controls.target = new THREE.Vector3(newX, newY, newZ);
    })
    .onComplete(function () {
        //controls.target.copy(scene.position);
        //console.log(scene.position);
        //controls.update();
        
        //controls.target.copy(controls.target);
        
        //TWEEN.removeAll(); 
        camera.lookAt(thisWalker.position);
        controls.enabled = true;
        
        //startRotation = new THREE.Euler().copy( camera.rotation );
        endRotation = new THREE.Euler().copy( camera.rotation );
        
    })
    .start();
    
    var camLook = {
        x: newX,
        y: newY,
        z: newZ
    };
    
    /*var tween = new TWEEN.Tween( camAngle )
    .to(camLook, 600)
    .easing( TWEEN.Easing.Linear.None )
    .onUpdate( function () {
        camera.lookAt( thisWalker.position );
    } )
    .onComplete( function () {

        camera.lookAt( thisWalker.position );

    } )
    .start();*/
    
    /*newRot = camera.rotation.z;
    
    var tweenCam = new TWEEN.Tween( {rotation: startRotation} ).to( {rotation: endRotation}, 800 ).easing(TWEEN.Easing.Linear.None)
    .onUpdate( function () {
        
        
        //camera.lookAt( thisWalker.position );
        camera.updateProjectionMatrix();
        console.log('YES');
        
        if(newRot < camRot ){
            
        } else {
            
        }
        
    } ).start();*/
    
    var lookAtVector = controls.target;
    console.log(lookAtVector);
    
//    var normalMatrix = new THREE.Matrix3().getNormalMatrix( thisWalker.matrixWorld );
//    var worldNormal = new THREE.Vector3(0,0,1).applyMatrix3( normalMatrix ).normalize();
//    var camPosition = new THREE.Vector3().copy(thisWalker.position).add(worldNormal.multiplyScalar(100));
    
    var rotateTween = new TWEEN.Tween(lookAtVector)
    .to({
        x: thisWalker.position.x,
        y: thisWalker.position.y,
        z: thisWalker.position.z
    }, 4000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
        camera.lookAt(lookAtVector);
    })
    .onComplete(function(){
        lookAtVector.copy(thisWalker.position);
    })
    .start();

    /*var goTween = new TWEEN.Tween(camera.position)
    .to(camPosition, 4000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start(); */
    
}

/*Get camera direction for lookat*/
var vector = new THREE.Vector3( 0, 0, -1 ),
    camAngle;

var startRotation,
    endRotation;


var animate = function () {
    
    TWEEN.update();
    
    requestAnimationFrame( animate );
    
    startRotation = new THREE.Euler().copy( camera.rotation );
    
    controls.update;
    
	renderer.render(scene, camera);
    
    
    //console.log(camera.rotation.z);
};

animate();
