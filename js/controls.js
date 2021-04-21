import * as THREE from '/three.js-dev/build/three.module.js';


//
//variables
//
var mouse = new THREE.Vector2();

//
//functions 
//

const mapRange = (value,inMin,inMax,outMin,outMax)=>(value-inMin)*(outMax-inMax)/(outMin-inMin)+inMax;

//change spaceship rotation depending on angle
export const lookAtMouseLocation = (obj) => {
    obj.rotation.x = mouse.y * 0.2;
    obj.rotation.y = mouse.x * -0.2;
    obj.rotation.z = mouse.y * mouse.x * -0.6;
};

//change speed and fov depending on angle
export const changeSpeed = (camera, controls, fov, movementSpeed) => {
    const distanceFactor = Math.sqrt((mouse.x * mouse.x) + (mouse.y * mouse.y)); // distance from center
    const fovDistanceFactor = mapRange(distanceFactor, 0, 1, 1, 0.90); // clamp and invert value range
    const speedDistanceFactor = mapRange(distanceFactor, 0, 1, 1, 0.75); // clamp and invert value range

    camera.fov = fov * fovDistanceFactor;
    controls.movementSpeed = movementSpeed * speedDistanceFactor;
}
    
//update mouse position on mousemove event
export const onMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
};

export const loadModels = (scene) => {
    const loader = new FBXLoader();
    loader.setPath('/models/');
    loader.load('testi.fbx', (fbx) => {
        fbx.traverse(c => {
            c.castShadow = true;
        })
        scene.add(fbx);
        fbx.position.set(0, 0, 0);
        fbx.scale.set(0.5, 0.5, 0.5);
    })

};