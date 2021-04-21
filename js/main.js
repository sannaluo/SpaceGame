import * as THREE from '/three.js-dev/build/three.module.js';
import { FlyControls } from '/three.js-dev/examples/jsm/controls/FlyControls.js';
import { FBXLoader } from '/three.js-dev/examples/jsm/loaders/FBXLoader.js';
import * as controls from '/js/controls.js';


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
const cube = new THREE.Mesh( geometry, material );
camera.add(cube);

cube.position.set(0,-1.5,-3);
cube.scale.set(0.4, 0.1, 0.6);


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
    controls.lookAtMouseLocation(cube);
    controls.changeSpeed(camera, flyControls, fov, movementSpeed);
    flyControls.update(delta);
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
};


//
//main loop
//

window.addEventListener('mousemove', (e) => controls.onMouseMove(e), false);
window.addEventListener('resize', () => onWindowResize(), false);


animate();
