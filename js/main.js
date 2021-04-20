import * as THREE from '/three.js-dev/build/three.module.js';
import {OrbitControls} from '/three.js-dev/examples/jsm/controls/OrbitControls.js';
import {shoot} from '/js/shooting.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

cube.position.set(0, 0, -5);
//camera.position.set(5, 10, 5);
camera.position.set(0, 0, 2);
//camera.lookAt(cube.position);


// test cube behind camera
const geometry3 = new THREE.BoxGeometry();
const material3 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube3 = new THREE.Mesh( geometry3, material3 );
scene.add( cube3 );
cube3.position.set(0, 0, 5);

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

// ship
const geometry2 = new THREE.BoxGeometry();
const material2 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const ship = new THREE.Mesh( geometry2, material2 );
scene.add( ship );
ship.position.set(0,0,0);
ship.scale.set(0.5, 0.5, 0.5);
ship.rotation.y = Math.PI / 4 ;

function loadPlayerShip() {

    ship.position.set(camera.position.x, camera.position.y - 1, camera.position.z - 1);

}

const animate = function () {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
    loadPlayerShip();
    shoot(camera, scene);
};

animate();