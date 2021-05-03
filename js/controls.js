import * as THREE from '../three.js-dev/build/three.module.js';

import { FBXLoader } from '../three.js-dev/examples/jsm/loaders/FBXLoader.js';
//
//variables
//
var mouse = new THREE.Vector2();

//
//functions 
//

const mapRange = (value,inMin,inMax,outMin,outMax)=>(value-inMin)*(outMax-inMax)/(outMin-inMin)+inMax;


/**
 * change spaceship rotation depending on angle
 * @param obj
 */
export const lookAtMouseLocation = (obj) => {
    obj.rotation.x = mouse.y * 0.2;
    obj.rotation.y = mouse.x * -0.2;
    obj.rotation.z = mouse.y * mouse.x * -0.6;
};


/**
 * change speed and fov depending on angle
 * @param camera
 * @param controls
 * @param fov
 * @param movementSpeed
 */
export const changeSpeed = (camera, controls, fov, movementSpeed) => {
    const distanceFactor = Math.sqrt((mouse.x * mouse.x) + (mouse.y * mouse.y)); // distance from center
    const fovDistanceFactor = mapRange(distanceFactor, 0, 1, 1, 0.85); // clamp and invert value range
    const speedDistanceFactor = mapRange(distanceFactor - (mouse.y/1.5), 0, 1, 1, 0.65); // clamp and invert value range

    if (mouse.y < -0.2) {
        controls.rollSpeed = Math.PI / 5 * speedDistanceFactor;
    } else {
        controls.rollSpeed = Math.PI / 5;
    }

    camera.fov = fov * fovDistanceFactor;
    controls.movementSpeed = movementSpeed * speedDistanceFactor;
};
    

/**
 * update mouse position on mousemove event
 * @param e
 */
export const onMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
};
