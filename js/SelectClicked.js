/*ratios height:width for blocks:
 * head:  4:5 i.e. 1:1.25
 * torso: 1:1
 * legs:  9:5 i.e. 1:0.55555555556
 */

/*
 * faces 2 and 3 of the cubes are their tops and bottoms
 */

var WIDTH = 400;
var HEIGHT = 600;


var container = document.createElement('div');
document.body.appendChild(container);
//var renderer = new THREE.CanvasRenderer();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
container.appendChild(renderer.domElement);

var objects = [];

var headMaterials = [];
for (var i = 0; i < 6; i++) {
    var mapUrl = '../images/head' + i + '.jpg';
    var map = THREE.ImageUtils.loadTexture(mapUrl);
    var mat = new THREE.MeshPhongMaterial({map: map});
    headMaterials.push(mat);
}
var cubeGeo = new THREE.CubeGeometry(2.5, 2, 2.5);
var headCube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial(headMaterials));


var materials = [];
for (var i = 0; i < 6; i++) {
    var mapUrl = '../images/torso' + i + '.jpg';
    var map = THREE.ImageUtils.loadTexture(mapUrl);
    var mat = new THREE.MeshPhongMaterial({map: map});
    materials.push(mat);
}

geometry = new THREE.CubeGeometry(2.5, 2.5, 2.5);
var torsoCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

var materials = [];
for (var i = 0; i < 6; i++) {
    var mapUrl = '../images/legs' + i + '.jpg';
    var map = THREE.ImageUtils.loadTexture(mapUrl);
    var mat = new THREE.MeshPhongMaterial({map: map});
    materials.push(mat);
}


geometry = new THREE.CubeGeometry(2.5, 4.5, 2.5);
var legsCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

headCube.position.y = 4.5;
torsoCube.position.y = 2.15;
legsCube.position.y = -1.45;

headCube.rotation.y = -9 * Math.PI / 10;
torsoCube.rotation.y = -9 * Math.PI / 10;
legsCube.rotation.y = -9 * Math.PI / 10;

objects.push(headCube);
objects.push(torsoCube);
objects.push(legsCube);

var scene = new THREE.Scene();
scene.add(headCube);
scene.add(torsoCube);
scene.add(legsCube);


var projector = new THREE.Projector();


var light = new THREE.DirectionalLight(0xfffccc, 1.5);
light.position.set(0, 0, 20);
scene.add(light);

var camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.z = 10;

function rotateHead() {
    if (radRotatedHead < 0.5 * Math.PI) {
        renderer.render(scene, camera);
        headCube.rotation.y += 0.01;
        requestAnimationFrame(rotateHead);
        radRotatedHead += 0.01;
    }

}

function rotateTorso() {
    if (radRotatedTorso < 0.5 * Math.PI) {
        renderer.render(scene, camera);
        torsoCube.rotation.y += 0.01;
        requestAnimationFrame(rotateTorso);
        radRotatedTorso += 0.01;
    }

}

function rotateLegs() {
    if (radRotatedLegs < 0.5 * Math.PI) {
        renderer.render(scene, camera);
        legsCube.rotation.y += 0.01;
        requestAnimationFrame(rotateLegs);
        radRotatedLegs += 0.01;
    }

}


function addMouseHandler(event)
{
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    render();
}


function onDocumentMouseDown(event) {

    event.preventDefault();

    var vector = new THREE.Vector3((event.clientX / WIDTH) * 2 - 1, -(event.clientY / HEIGHT) * 2 + 1, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {

        //intersects[ 0 ].object.material.color.setHex(Math.random() * 0xffffff);
        if (intersects[0].object == headCube) {
            radRotatedHead = 0;
            numSpins++;
            rotateHead();
            renderer.render(scene, camera);
        }
        else if (intersects[0].object == torsoCube) {
            radRotatedTorso = 0;
            numSpins++;
            rotateTorso();
            renderer.render(scene, camera);
        }
        else if (intersects[0].object == legsCube) {
            radRotatedLegs = 0;
            numSpins++;
            rotateLegs();
            //make sure section spun exactly PI/2 rad
            //legsCube.rotation.y = numSpins * 0.5 * Math.PI;
            renderer.render(scene, camera);
        }


    }
}

function render(){
    requestAnimationFrame(render);
    
    renderer.render(scene,camera);
}

function changeMesh(){
    //triggered on button press!
    var newImage = document.getElementById('canvasImage');
    var mapUrl = newImage.src;
   // alert("hi" + mapUrl);
    var map = THREE.ImageUtils.loadTexture(mapUrl);
    var mat = new THREE.MeshPhongMaterial({map: map});
    headMaterials[0] = mat;

headCube.material = new THREE.MeshFaceMaterial(headMaterials);
}

var spinning = false;
var radRotatedHead;
var radRotatedTorso;
var radRotatedLegs;
var numSpins = 0;

//renderer.render(scene,camera);
addMouseHandler();

