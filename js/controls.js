import * as THREE from '/three.js-dev/build/three.module.js';

export const onMouseMove = (event, object) => {
    object.rotation.y += event.movementX * 0.005;
    object.rotation.x -= event.movementY * 0.005;
}

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