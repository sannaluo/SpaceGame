import * as THREE from '/three.js-dev/build/three.module.js';
import {OrbitControls} from '/three.js-dev/examples/jsm/controls/OrbitControls.js';
import {shoot} from '/js/shooting.js';
// import {breaking} from '/js/breaking.js';

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