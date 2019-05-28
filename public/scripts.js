var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
    color: 0xffffff
});
var cube = new THREE.Mesh(geometry, material);
//scene.add( cube );

camera.position.x = 2;
camera.position.y = 0.5;
camera.position.z = 1;

//camera.lookAt(scene.position);

var camRot = 0.5235987755982987,
    newRot;

renderer.setClearColor(0xffffff, 1);


var scene = new THREE.Scene();
fogColor = new THREE.Color(0xffffff);

scene.background = fogColor;
//scene.fog = new THREE.Fog(fogColor, 0.0025, 20);



var controls = new THREE.OrbitControls(camera, renderer.domElement);
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

var light = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(light);

/*LOADING MANAGER*/
var manager = new THREE.LoadingManager();
manager.onStart = function(url, itemsLoaded, itemsTotal) {
    /*console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );*/
};

manager.onLoad = function() {
    //console.log( 'Loading complete!');
    /*camera.rotation.set(-0.7853981633974483,0.6154797086703874,0.6154797086703874);
    camera.updateProjectionMatrix(); */
};


manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    /*console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );*/

    if (itemsLoaded == itemsTotal) {
        console.log('All items loaded!!!');
        repositionObj();
    }

};

manager.onError = function(url) {
    console.log('There was an error loading ' + url);
};


/*LOAD MULTIOPLE MODELS*/
// Texture and OBJ loader
var index = 0;
let OBJfiles = ['AT-ACT', 'AT-ST', 'AT-AT', 'AT-DP', 'AT-AP', 'AT-TE', 'AT-DT', 'AT-PT', 'AT-RT'];
let _MTLLoader = new THREE.MTLLoader().setPath('models/');

// this function will load the next MTL and OBJ file in the queue
function loadNextMTL() {

    if (index > OBJfiles.length - 1) return;

    _MTLLoader.load(OBJfiles[index] + '.mtl', function(materials) {
        materials.preload();
        new THREE.OBJLoader(manager)
            .setMaterials(materials)
            .setPath('models/')
            .load(OBJfiles[index] + '.obj', function(object) {

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

loadNextMTL(); // kick off the preloading routine

/*REPOSITION OBJECTS*/
function repositionObj() {
    objects.forEach(function(index, element) {
        var objName = index.userData.name;
        if (objName == 'AT-ACT') {
            //objects[numb].position.z = -20;
            index.position.z = -28;
            index.userData.class = "bigWalker"
        } else if (objName == 'AT-AT') {
            index.position.z = -22;
            index.userData.class = "bigWalker"
        } else if (objName == 'AT-DP') {
            index.position.z = -17;
            index.userData.class = "mediumWalker"
        } else if (objName == 'AT-ST') {
            index.position.z = -14;
            index.userData.class = "mediumWalker"
        } else if (objName == 'AT-AP') {
            index.position.z = -11;
            index.position.x = 1;
            index.userData.class = "mediumWalker"
        } else if (objName == 'AT-TE') {
            index.position.z = -7;
            index.userData.class = "mediumWalker"
        } else if (objName == 'AT-DT') {
            index.position.z = -4;
            index.userData.class = "mediumWalker"
        } else if (objName == 'AT-PT') {
            index.position.z = -2;
            index.userData.class = "smallWalker"
        } else if (objName == 'AT-RT') {
            index.position.z = 0;
            index.userData.class = "smallWalker"
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
var intersects;

var objectName;

// mouse listener
document.addEventListener('click', function(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            //INTERSECTED.material.color.setHex(150000);

            objectName = INTERSECTED.parent.userData.name;

            console.log(objectName);
            var walkerModel = INTERSECTED.parent;
            lookAtWalker(walkerModel);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }
}, false);


document.addEventListener('mousemove', function(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
        container.style.cursor = 'pointer';
    } else {
        container.style.cursor = 'auto';
    }
}, false);


function lookAtWalker(thisWalker) {
    var speed = 800;
    
    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };

    var to;
    
    var walkerClass = thisWalker.userData.class;
    
    console.log(walkerClass);
    
    if(walkerClass == 'smallWalker'){
        to = {
            x: thisWalker.position.x + 2,
            y: thisWalker.position.y + 0.5,
            z: thisWalker.position.z + 1
        };
    } else if(walkerClass == 'mediumWalker'){
        to = {
            x: thisWalker.position.x + 3,
            y: thisWalker.position.y + 2,
            z: thisWalker.position.z + 3
        };
    } else{
        to = {
            x: thisWalker.position.x + 10,
            y: thisWalker.position.y + 8,
            z: thisWalker.position.z + 5
        };
    }
    
    var newX = thisWalker.position.x,
        newY = thisWalker.position.y,
        newZ = thisWalker.position.z

    TWEEN.removeAll(); // remove previous tweens if needed

    var tween = new TWEEN.Tween(from)
    .to(to, speed)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
            camera.position.set(this.x, this.y, this.z);
            controls.enabled = false;
            controls.target = new THREE.Vector3(newX, newY, newZ);
            $('body').addClass('noclick');
        })
        .onComplete(function() {
            controls.enabled = true;
            $('body').removeClass('noclick');
        })
        .start();

    var lookAtVector = controls.target;
    console.log(lookAtVector);

    var rotateTween = new TWEEN.Tween(lookAtVector)
        .to({
            x: thisWalker.position.x,
            y: thisWalker.position.y,
            z: thisWalker.position.z
        }, speed)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
            camera.lookAt(lookAtVector);
        })
        .onComplete(function() {
            lookAtVector.copy(thisWalker.position);
        })
        .start();
}

/*Get camera direction for lookat*/
var vector = new THREE.Vector3(0, 0, -1),
    camAngle;

var startRotation,
    endRotation;


var animate = function() {

    TWEEN.update();

    requestAnimationFrame(animate);

    startRotation = new THREE.Euler().copy(camera.rotation);

    controls.update;

    renderer.render(scene, camera);


    //console.log(camera.rotation.z);
};

animate();