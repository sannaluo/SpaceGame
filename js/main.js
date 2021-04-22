import * as THREE from '/three.js-dev/build/three.module.js';
//import {OrbitControls} from '/three.js-dev/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from '/three.js-dev/examples/jsm/controls/FlyControls.js';
import { FBXLoader } from '/three.js-dev/examples/jsm/loaders/FBXLoader.js';
import * as controls from '/js/controls.js';
import {shoot} from '/js/shooting.js';
// import {breaking} from '/js/breaking.js';

import {countDestroyableObjects} from "/js/counter.js";


//
//initialize
//

//renderer init
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);



//init variables
const clock = new THREE.Clock();
const movementSpeed = 1.8;

//scene init
const scene = new THREE.Scene();
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    './img/px.png',
    './img/nx.png',
    './img/py.png',
    './img/ny.png',
    './img/pz.png',
    './img/nz.png',
])
scene.background = texture;

//camera init
const fov = 80;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 5, 0);

scene.add(camera);


//lights init
let light = new THREE.DirectionalLight(0xFFFFFF);
scene.add(light);

light = new THREE.AmbientLight(0x404040);
scene.add(light);

// controls init
const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.autoForward = true;
flyControls.dragToLook = false;
flyControls.domElement = renderer.domElement;
flyControls.rollSpeed = Math.PI / 5;
flyControls.movementSpeed = movementSpeed;


//player init
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
const playerCube = new THREE.Mesh( geometry, material );
camera.add(playerCube);

playerCube.position.set(0,-1.5,-3);
playerCube.scale.set(0.4, 0.1, 0.6);

//destroyable cubes init

// test cube in front of camera
const geometry2 = new THREE.BoxGeometry();
const material2 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube2 = new THREE.Mesh( geometry2, material2 );
scene.add( cube2 );

// test cube behind camera
const geometry3 = new THREE.BoxGeometry();
const material3 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube3 = new THREE.Mesh( geometry3, material3 );
scene.add( cube3 );

cube2.position.set(2, 0, -9);
//camera.position.set(0, 0, 2);
cube3.position.set(0, 0, 5);

cube2.tag = "destroyable";
cube3.tag = "destroyable";


// helper init
const size = 20;
const divisions = 20;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);




//
//functions
//
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

};
const animate = () => {
    let delta = clock.getDelta();
    requestAnimationFrame(animate);
    controls.lookAtMouseLocation(playerCube);
    controls.changeSpeed(camera, flyControls, fov, movementSpeed);
    flyControls.update(delta);
    
    shoot(camera, scene, playerCube);
    countDestroyableObjects(scene);

    camera.updateProjectionMatrix();
    renderer.render(scene, camera);


};


//
//main loop
//

window.addEventListener('mousemove', (e) => controls.onMouseMove(e), false);
window.addEventListener('resize', () => onWindowResize(), false);


animate();





/////////////////////////////////////////
/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// test cube in front of camera
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// test cube behind camera
const geometry3 = new THREE.BoxGeometry();
const material3 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube3 = new THREE.Mesh( geometry3, material3 );
scene.add( cube3 );

cube.position.set(2, 0, -9);
camera.position.set(0, 0, 2);
cube3.position.set(0, 0, 5);

cube.tag = "destroyable";
cube3.tag = "destroyable";

//lights
const directionalLight = new THREE.DirectionalLight( 0xFFECA4,0.2 );
directionalLight.position.set( 0.1, 0.2, 1 );
scene.add( directionalLight );
const light = new THREE.AmbientLight( 0xFFF6D5, 0.4 ); // soft white light
scene.add( light );


// axes helper
//const axesHelper = new THREE.AxesHelper( 5 );
//scene.add( axesHelper );

// orbit controls
const controls = new OrbitControls( camera, renderer.domElement );

const animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    shoot(camera, scene);
   // breaking();
};

animate();
*/