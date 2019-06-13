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
light.position.set(0, 10, 10);
light.target.position.set(1, 0, 0);
light.shadow.camera.near = near;
light.shadow.camera.far = far;
light.shadow.camera.left = -15;
light.shadow.camera.bottom = -15;
light.shadow.camera.right = 15;
light.shadow.camera.top = 15;
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
//scene.add(light);


/*LOADING MANAGER*/
var manager = new THREE.LoadingManager();
manager.onStart = function(url, itemsLoaded, itemsTotal) {
    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function() {
    //console.log( 'Loading complete!');
    /*camera.rotation.set(-0.7853981633974483,0.6154797086703874,0.6154797086703874);
    camera.updateProjectionMatrix(); */
};


manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    /*console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );*/

    /*console.log(itemsLoaded);
    console.log(itemsTotal);*/

    repositionObj(true);
    
    if (itemsLoaded === 9) { //fires once
        console.log(itemsTotal);
        scene.add(plane);
        //scene.add( cube );
        repositionObj(false);
    }

};

manager

manager.onError = function(url) {
    console.log('There was an error loading ' + url);
};


/*CREATE LABELS WITH CANVAS*/
var labelGroup = [];
var walker;

function makeLabelCanvas(size, name) {
    var borderSize = 2;
    var ctx = document.createElement('canvas').getContext('2d');
    var font = `${size}px 'orbitron'`;
    ctx.font = font;
    // measure how long the name will be
    var doubleBorderSize = borderSize * 2;
    var width = ctx.measureText(name).width + doubleBorderSize;
    var height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'top';

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'yellow';
    ctx.fillText(name, borderSize, borderSize);

    return ctx.canvas;
}

function drawLabel(walker, wclass, name) {
    //console.log(wclass);

    var size = 100;
    var baseDistance,
        baseScale;

    baseDistance = 0.80;

    if ((name == 'AT-ST') || (name == 'AT-AP')) {
        baseDistance = 1.5;
    } else if (name == 'AT-RT') {
        baseDistance = 0.50;
    } else if (name == 'AT-PT') {
        baseDistance = 0.60;
    } else if (name == 'AT-DP') {
        baseDistance = 0.6;
    } else if (name == 'AT-ACT') {
        baseDistance = 4.2;
    } else if ((name == 'AT-DP') || (name == 'AT-AT')) {
        baseDistance = 2;
    } else {
        baseDistance = 0.99;
    }


    switch(name){
        default:
            baseScale = 0.001;
            break;
        case 'AT-ACT':
        case 'AT-AT':
            baseScale = 0.004;
            break;
        case 'AT-TE':
        case 'AT-AP':
        case 'AT-DT':
        case 'AT-ST':
        case 'AT-DP':
            baseScale = 0.002;
            break;
    }



    var walkerHeight = walker.children[0].geometry.boundingSphere.center.y;

    //console.log(walker.children[0].geometry.boundingSphere.center.y);

    const canvas = makeLabelCanvas(size, name);
    const texture = new THREE.CanvasTexture(canvas);
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        //side: THREE.DoubleSide,
        transparent: true,
    });

    const root = new THREE.Object3D();
    root.position.x = walker.position.x;
    var label = new THREE.Sprite(labelMaterial);
    root.add(label);
    label.position.y = walkerHeight + baseDistance;
    label.position.z = walker.position.z;
    label.rotation.y = Math.PI / 2;

    // if units are meters then 0.01 here makes size
    // of the label into centimeters.
    var labelBaseScale = baseScale;
    //console.log(baseScale);
    label.scale.x = canvas.width * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;

    //Gives labels a nameset
    label.name = name;

    if (name == 'AT-RT') {
        label.material.opacity = 1;
    } else {
        label.material.opacity = 0;
    }

    //label.material.opacity = 1;

    labelGroup.push(label);

    scene.add(root);

    //makeLabelCanvas(size, name);
};

/*CREATE WALKER DATA SETS*/
var dataCards = [];
var jsonName;
var infoCards = []
const labelGeometry = new THREE.PlaneBufferGeometry(1, 1);

function makeDataCanvas(size, content) {
    var borderSize = 55;
    /*var canvas = document.getElementById('dataLoad');
    var context = canvas.getContext('2d');*/

    var content = document.getElementById(content);
    
    var context = document.createElement('canvas').getContext('2d');

    console.log(content);
    
    /*var canvas = document.createElement('canvas');

    var canvas = canvas.setAttribute('id', name);

    var context = document.getElementById(name).getContext('2d');*/

    /*var font = `${size}px arial`;
    context.font = font;*/
    // measure how long the name will be
    var doubleBorderSize = borderSize * 2;
   /* var width = context.measureText(name).width + doubleBorderSize;
    var height = size + doubleBorderSize;*/
    
    var width = content.width + doubleBorderSize;
    var height = content.height + doubleBorderSize;
    
    context.canvas.width = width;
    context.canvas.height = height;

    // need to set font again after resizing canvas
    /*context.font = font;
    context.textBaseline = 'top';*/

    context.fillStyle = 'transparent';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillText(content, borderSize, borderSize);
    
    context.drawImage(content, 2,2);

    return context.canvas;
}

function drawData(walker, wclass, name) {
    var size= 100;

    //Check function only gets triggered once

    //const walkerHeight = walker.children[0].geometry.boundingSphere.center.y;

    /*console.log(walker.userData.name);
    console.log(walker);*/

    //LOAD JSON!
    //console.log('the name is: '+name);

    

    //loadJSON(jsonName);
        
    //console.log(infoCards[0][jsonName]);
    
    //$('body').after(dataDiv); 
    
    //buildDataDiv(jsonName);
    //console.log(('.'+jsonName));
    
    
    
    var canvas = makeDataCanvas(size, name);
    var texture = new THREE.CanvasTexture(canvas);
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    var labelMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
    });

    var root = new THREE.Object3D();
    root.position.x = walker.position.x + 0.5;
    var dataSet = new THREE.Mesh(labelGeometry, labelMaterial);
    root.add(dataSet);
    dataSet.position.y = walker.position.y + 0.01;
    dataSet.position.z = walker.position.z;
    dataSet.rotation.x = -Math.PI / 2;
    dataSet.rotation.z = Math.PI / 2;

    // if units are meters then 0.01 here makes size
    // of the dataSet into centimeters.
    var dataBaseScale = 0.001;
    dataSet.scale.x = canvas.width  * dataBaseScale;
    dataSet.scale.y = canvas.height * dataBaseScale;

    scene.add(root);

    dataCards.push(dataSet);
};

/*Get data from JSON*/
// load the JSON file
var json;
var walkerDetails;
var dataDiv;
function loadJSON(walker) {
    console.log('loaded');
    $.getJSON('json/walkerData.json').done(function(data) {
        /*if (!walker){
            json = data;
            console.log(data);  
            console.log('no data provided');
            
        } else{
            //json = data.walkers[walker];
            json = data.walkers;
            infoCards.push(json);

            getUnique(infoCards, 'Name');
            //Returns infoCard details
            walkerDetails = infoCards[0][jsonName]
            //create div with desired data and append to body
            //console.log(walkerDetails);
            
            //console.log(infoCards[0]);
            
            dataDiv = "<div class='" + jsonName + " dataDiv'>" +
                "<h1>" + walkerDetails.Name + "'</h1>" +
                "<p class='manufacturer'><span>Manufacturer:</span>" + walkerDetails.Manufacturer + "'</p>" +
                "<p class='model'><span>Model:</span>" + walkerDetails.Model + "'</p>" +
                "<p class='size'><span>Size:</span>" + walkerDetails.Size + "'</p>" +
                "<p class='armament'><span>Armament:</span>" + walkerDetails.Armament + "'</p>" +
                "<p class='crew'><span>Crew:</span>" + walkerDetails.Crew + "'</p>" +
                "<p class='cargo'><span>Cargo capacity:</span>" + walkerDetails.Cargo + "'</p>" +
                "</div>";

            //html2canvas(document.querySelector("." + jsonName)).then(canvasData => {
                //canvasData.id = '"' + canvasID + '"';
                //canvasData.setAttribute('id', jsonName);
                //canvasData.setAttribute('class', 'drawnCanvas');
                //document.body.appendChild(canvasData);

                //removeDups('.drawnCanvas', 'id');
            //});
            
            return dataDiv;
        }*/
        
        json = data;
        console.log(data);  
        console.log('no data provided');
        
        return json;
        
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    });
};

loadJSON();

function getUnique(arr, comp) {

    var unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

    infoCards = unique;

    //console.log(infoCards);

    //return unique;
}


function buildDataDiv(dataID){
    html2canvas(document.querySelector("." + dataID)).then(canvas => {
        document.body.appendChild(canvas)
    });
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

            object.children[0].geometry.computeBoundingSphere();

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
function repositionObj(reposition) {
    objects.forEach(function(index, element) {
        var objName = index.userData.name,
            wclass = index.userData.class;
        
        if(reposition){
            if (objName == 'AT-ACT') {
                //objects[numb].position.z = -20;
                index.position.z = -28;
                index.userData.class = "bigWalker"
            } else if (objName == 'AT-AT') {
                index.position.z = -22;
                index.userData.class = "bigWalker";
            } else if (objName == 'AT-DP') {
                index.position.z = -17;
                index.userData.class = "mediumWalker";
            } else if (objName == 'AT-ST') {
                index.position.z = -14;
                index.userData.class = "mediumWalker";
            } else if (objName == 'AT-AP') {
                index.position.z = -11;
                index.position.x = 0.5;
            } else if (objName == 'AT-TE') {
                index.position.z = -7;
            } else if (objName == 'AT-DT') {
                index.position.z = -4;
            } else if (objName == 'AT-PT') {
                index.position.z = -2;
            } else if (objName == 'AT-RT') {
                index.position.z = 0;
                index.rotation.x = 0.05;
            }
        } else{
            
            if (objName == 'AT-ACT') {
                index.userData.class = "bigWalker"
                wclass = index.userData.class;
            } else if (objName == 'AT-AT') {
                index.userData.class = "bigWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-DP') {
                index.userData.class = "mediumWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-ST') {
                index.userData.class = "mediumWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-AP') {
                index.userData.class = "mediumWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-TE') {
                index.userData.class = "mediumWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-DT') {
                index.userData.class = "mediumWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-PT') {
                index.userData.class = "smallWalker";
                wclass = index.userData.class;
            } else if (objName == 'AT-RT') {
                index.userData.class = "smallWalker";
                wclass = index.userData.class;
            }
            
            console.log(objName);
            jsonName = objName.replace("-","");
            console.log('the JSON is: '+jsonName);

            drawLabel(index, wclass, objName);

            walkerDetails = json.walkers[jsonName];

            if(walkerDetails == undefined){

            } else{
                console.log(walkerDetails);
                console.log(walkerDetails.Name);
                dataDiv = "<div class='" + jsonName + " dataDiv'>" +
                    "<h1>" + walkerDetails.Name + "'</h1>" +
                    "<p class='manufacturer'><span>Manufacturer:</span>" + walkerDetails.Manufacturer + "'</p>" +
                    "<p class='model'><span>Model:</span>" + walkerDetails.Model + "'</p>" +
                    "<p class='size'><span>Size:</span>" + walkerDetails.Size + "'</p>" +
                    "<p class='armament'><span>Armament:</span>" + walkerDetails.Armament + "'</p>" +
                    "<p class='crew'><span>Crew:</span>" + walkerDetails.Crew + "'</p>" +
                    "<p class='cargo'><span>Cargo capacity:</span>" + walkerDetails.Cargo + "'</p>" +
                    "</div>";

                console.log(dataDiv);
                
                $('body').after(dataDiv);
                
                //After appending divs to body, draw each into a canvas
                
                var canvasID = jsonName;
                console.log('canvas ID IS: ' + canvasID);
                
                html2canvas(document.querySelector("." + jsonName)).then(canvasData => {
                    //canvasData.id = '"' + canvasID + '"';
                    canvasData.setAttribute('id', canvasID);
                    canvasData.setAttribute('class', 'drawnCanvas');
                    document.body.appendChild(canvasData);
                    drawData(index, wclass, canvasID);
                    console.log('here');
                });
                
                
                
            };
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
            x: thisWalker.position.x + 11,
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
    //console.log(lookAtVector);

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

    //Label functions
    var thisLabel = thisWalker.userData.name;

    //console.log(thisLabel);

    var labelTween = labelGroup.forEach(function(index, element) {
        //console.log(index.userData.labelName);
        new TWEEN.Tween(scene.getObjectByName(thisLabel).material)
            .to({
            opacity: 1
        }, 1000)
            .onStart(function() {
            index.material.opacity = 0;
        })
            .start();
    });
}

var animate = function() {

    TWEEN.update();

    requestAnimationFrame(animate);

    controls.update;

    renderer.render(scene, camera);
};

animate();