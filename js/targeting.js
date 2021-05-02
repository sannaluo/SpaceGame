import * as THREE from '../three.js-dev/build/three.module.js';

let colour = 0xffffff;

const map = new THREE.TextureLoader().load( './textures/white-crosshair.png' );
const material = new THREE.SpriteMaterial( { map: map, color: colour } );

const sprite = new THREE.Sprite( material );
sprite.scale.set(0.2, 0.2, 1);


function animateCrosshair(scene) {
    
    
    scene.add( sprite );
}


export function targeting(scene) {
   animateCrosshair(scene);
}