/**
 * used help from https://github.com/saucecode/threejs-demos/blob/master/09_Shooting/demo.js
 */

import * as THREE from '/three.js-dev/build/three.module.js';

// Bullets array
let bullets = [];
let keyEvents = {};
let player = {canShoot:0};

// raycaster
const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector2();
rayDirection.x = 0;
rayDirection.y = 0;

/**
 * Shoots balls when spacebar is pressed down.
 * @param camera
 * @param scene
 */
export function shoot(camera, scene) {
    raycaster.setFromCamera( rayDirection, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children );
    for ( let i = 0; i < intersects.length; i ++ ) {
        // do something
        //intersects[ i ].object.material.color.set( 0xff0000 );
        //console.log(intersects[ i ].object.name);
    }

    // go through bullets array and update position
    // remove bullets when appropriate
    for(let index = 0; index < bullets.length; index += 1){
        if( bullets[index] === undefined ) continue;
        if( bullets[index].alive == false ){
            bullets.splice(index,1);
            continue;
        }

        bullets[index].position.add(bullets[index].velocity);
    }

    if(keyEvents[32] && player.canShoot <= 0) { // spacebar
        // creates a bullet as a Mesh object
        let bullet = new THREE.Mesh(
            new THREE.SphereGeometry(1,8,8),
            new THREE.MeshBasicMaterial({color:0xffffff})
        );

        bullet.scale.set(0.5, 0.5, 0.5);
        bullet.position.set(camera.position.x, camera.position.y - 2, camera.position.z - 1);

        // set the velocity of the bullet
        bullet.velocity = new THREE.Vector3(raycaster.ray.direction.x, raycaster.ray.direction.y, raycaster.ray.direction.z);

        // after 1000ms, set alive to false and remove from scene
        // setting alive to false flags our update code to remove
        // the bullet from the bullets array
        bullet.alive = true;
        setTimeout(function(){
            bullet.alive = false;
            scene.remove(bullet);
        }, 1000);

        // add to scene, array, and set the delay to 10 frames
        bullets.push(bullet);
        scene.add(bullet);
        player.canShoot = 10;
    }
    if(player.canShoot > 0) player.canShoot -= 1;
}

function keyDown(event){
    event.preventDefault();
    keyEvents[event.keyCode] = true;
}

function keyUp(event){
    keyEvents[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

