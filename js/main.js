import * as THREE from '../three.js-dev/build/three.module.js';
//import {OrbitControls} from '../three.js-dev/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from '../three.js-dev/examples/jsm/controls/FlyControls.js';
import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '../three.js-dev/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../three.js-dev/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../three.js-dev/examples/jsm/postprocessing/UnrealBloomPass.js';

import * as controls from '../js/controls.js';
import * as shooting from '../js/shooting2.js';
import * as menu from '../js/menu.js';

import {loadModel} from '../js/modelLoader.js';
import {countDestroyableObjects} from "../js/counter.js";
import {createStars, createDestroyables} from '../js/particles.js';
import {playMusic} from "../js/music.js";

// for vr
//import { VRButton } from '../three.js-dev/examples/jsm/webxr/VRButton.js';

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

// for vr
//renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);

//init variables
const clock = new THREE.Clock();
const movementSpeed = 2.8;

//scene init
const scene = new THREE.Scene();
const loader = new THREE.CubeTextureLoader();
const worldTexture = loader.load([
    './img/px.png',
    './img/nx.png',
    './img/py.png',
    './img/ny.png',
    './img/pz.png',
    './img/nz.png',
]);
scene.background = worldTexture;


//camera init
const fov = 85;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 130;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

scene.add(camera);

//lights init
let light = new THREE.DirectionalLight(0xdedede);
scene.add(light);

light = new THREE.AmbientLight(0xb0b0b0);
scene.add(light);

// controls init
const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.autoForward = true;
flyControls.dragToLook = false;
flyControls.domElement = renderer.domElement;
flyControls.rollSpeed = Math.PI / 5;
flyControls.movementSpeed = movementSpeed;


//player init
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshToonMaterial({ color: 0x00ff00 });
const playerCube = new THREE.Mesh(geometry, material);
playerCube.material.transparent = true;
playerCube.material.opacity = 0;

playerCube.position.set(0, -0.5, -1);

camera.add(playerCube);

// ship texture settings
const tuomaanalus = [
    {
        name: "runko",
        roughness: 0.8,
        clearcoat: 0.5, 
        clearcoatRoughness: 0.5,
    },
    {
        name: "musta",
        color: "0x222222", 
        roughness: 0.8,
        metalness: 0.2,
        
    },
    {
        name: "lasi",
        roughness: 0,
        emissive: "baseColor", 
        emissiveIntensity: 0.5,
    },
    {
        name: "moottori",
        roughness: 1,
        emissive: "baseColor", 
        emissiveIntensity: 3,
    }
];

const destroyer = [
    {
        name: "tuulilasi",
        roughness: 0,
        emissive: "baseColor",
        emissiveIntensity: 0.5,
    },
    {
        name: "moottori",
        roughness: 1,
        emissive: "baseColor",
        emissiveIntensity: 3,
    }
];

//bloom init
const params = {
    exposure: 1,
    bloomStrength: 0.8,
    bloomThreshold: 0.55,
    bloomRadius: 0
};
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


//
//functions
//


const initEnvironment = () => {
    createStars(scene);
    createDestroyables(scene);
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {

    let delta = clock.getDelta();
    requestAnimationFrame(animate);
    controls.lookAtMouseLocation(playerCube);
    controls.changeSpeed(camera, flyControls, fov, movementSpeed);
    flyControls.update(delta);

    countDestroyableObjects(scene, camera);

    shooting.updateRaycast(playerCube);
    shooting.shoot(delta, 0.2, playerCube, scene, camera);
    shooting.moveBullets(delta, scene, camera);

    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    composer.render();

};


//
//main loop
//

const buttons = document.getElementsByClassName("selectBtn");

if(buttons){

    for(let i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener('click', function () {
            let selected = buttons[i].id;
            menu.hideMenu();

            // set texture settings to selected model
            let shipTextures = tuomaanalus;

            if(selected === "destroyer") {
                shipTextures = destroyer;
            }

            loadModel('./models/'+selected+'.gltf', playerCube, shipTextures,  worldTexture);
            playerCube.scale.set(0.8, 0.8, 0.8);
            initEnvironment();
            playMusic(camera, 'space-ambient', true);
            shooting.initRaycast(playerCube, scene, 12, camera);
            window.addEventListener('mousemove', (e) => controls.onMouseMove(e), false);
            window.addEventListener('resize', () => onWindowResize(), false);

            // for vr
            //document.body.appendChild( VRButton.createButton( renderer ) );

            animate();
            // for vr
           // renderer.setAnimationLoop( animate );
        });
    }
}



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