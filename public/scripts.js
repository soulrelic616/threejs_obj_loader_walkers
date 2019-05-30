var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
    color: 0xffffff
});
var cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;

var texture, floorMaterial, plane;

texture = THREE.ImageUtils.loadTexture('models/floor_2.png');

// assuming you want the texture to repeat in both directions:
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// how many times to repeat in each direction; the default is (1,1),
//   which is probably why your example wasn't working
texture.repeat.set(200, 200);
floorMaterial = new THREE.MeshLambertMaterial({
    map: texture
});
plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), floorMaterial);
plane.material.side = THREE.DoubleSide;
plane.position.x = 0;
// rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
// Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
plane.rotation.z = Math.PI / 2;
plane.rotation.x = Math.PI / 2;

plane.castShadow = true;
plane.receiveShadow = true;

camera.position.x = 2;
camera.position.y = 0.5;
camera.position.z = 1;

//camera.lookAt(scene.position);

var camRot = 0.5235987755982987,
    newRot;

renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
// to antialias the shadow
renderer.shadowMapType = THREE.PCFSoftShadowMap;

renderer.shadowMap.renderReverseSided = true; // default is true
renderer.shadowMap.renderSingleSided = false; // default is true


var scene = new THREE.Scene();
fogColor = new THREE.Color(0x000000);

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.0025, 30);



var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.campingFactor = 0.25;
controls.enableZoom = true;

controls.maxPolarAngle = Math.PI / 2.5;

controls.minDistance = 2;
controls.maxDistance = 15;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.5);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.2);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.castShadow = true;
backLight.position.set(100, 0, -100).normalize();

//scene.add(keyLight);
//scene.add(fillLight);///////////
//scene.add(backLight);

var ambientLight = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(ambientLight);


var near = 0.1;
var far = 1000;
// Add Lighting
var light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(0,10,10);
light.target.position.set(1,0,0);
light.shadow.camera.near = near;       
light.shadow.camera.far = far;      
light.shadow.camera.left = -15;
light.shadow.camera.bottom = -15;
light.shadow.camera.right = 15;
light.shadow.camera.top	= 15;
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
//scene.add(light);


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
        scene.add(plane);
        //scene.add( cube );
        repositionObj();
    }

};

manager.onError = function(url) {
    console.log('There was an error loading ' + url);
};


/*CREATE LABELS WITH CANVAS*/

function randInt(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min | 0;
}

const labelGeometry = new THREE.PlaneBufferGeometry(1, 1);
const x = randInt(256);
const bodyRadiusTop = .4;
const bodyRadiusBottom = .2;
const bodyHeight = 2;

function makeLabelCanvas(size, name) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const font =  `${size}px bold sans-serif`;
    ctx.font = font;
    // measure how long the name will be
    const doubleBorderSize = borderSize * 2;
    const width = ctx.measureText(name).width + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'top';

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(name, borderSize, borderSize);

    return ctx.canvas;
    
    console.log(ctx.canvas);
    console.log('YAY!');
}


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

                object.castShadow = true;
                object.receiveShadow = true;

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
            index.position.x = 0.5;
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
            index.rotation.x = 0.05;
            index.userData.class = "smallWalker"
            
            var size= 20;
            const canvas = makeLabelCanvas(size, name);
            const texture = new THREE.CanvasTexture(canvas);
            // because our canvas is likely not a power of 2
            // in both dimensions set the filtering appropriately.
            texture.minFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            const labelMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
            });
            
            const root = new THREE.Object3D();
            root.position.x = index.position.x;
            const label = new THREE.Mesh(labelGeometry, labelMaterial);
            root.add(label);
            label.position.y = index.position.y * 4 / 5;
            label.position.z = index.position.z;
            label.rotation.x = 90;
            
            // if units are meters then 0.01 here makes size
            // of the label into centimeters.
            const labelBaseScale = 0.01;
            label.scale.x = canvas.width  * labelBaseScale;
            label.scale.y = canvas.height * labelBaseScale;

            scene.add(root);
            
            makeLabelCanvas('test', 'test');
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

    if (walkerClass == 'smallWalker') {
        to = {
            x: thisWalker.position.x + 2,
            y: thisWalker.position.y + 0.5,
            z: thisWalker.position.z + 1
        };
    } else if (walkerClass == 'mediumWalker') {
        to = {
            x: thisWalker.position.x + 3,
            y: thisWalker.position.y + 3,
            z: thisWalker.position.z + 3
        };
    } else {
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

function getDescription(walker) {
    $.get('https://starwars.fandom.com/wiki/All_Terrain_Recon_Transport').then(function(html) {
        // Success response
        var $mainbar = $(html).find('#canontab');
        console.log($mainbar.html());
    }, function() {
        // Error response
        console.log('Access denied');
    });
}

var animate = function() {

    TWEEN.update();

    requestAnimationFrame(animate);

    controls.update;

    renderer.render(scene, camera);


    //console.log(camera.rotation.z);
};

animate();