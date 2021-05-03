/**
 * used help from https://github.com/saucecode/threejs-demos/blob/master/09_Shooting/demo.js
 */

/**
 * This file is not used. See shooting2.js
 */

import * as THREE from '/three.js-dev/build/three.module.js';
import { targeting } from '/js/targeting.js';

// Bullets array
let bullets = [];
let keyEvents = {};
let player = { canShoot: 0 };

// raycaster
const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector2();
rayDirection.x = 0;
rayDirection.y = 0;

function shootAt(scene, camera, pos, playerCube) {

    // go through bullets array and update position
    // remove bullets when appropriate
    /*  for(let index = 0; index < bullets.length; index += 1){
          if( bullets[index] === undefined ) continue;
          if( bullets[index].alive == false ){
              bullets.splice(index,1);
              continue;
          }
  
          //console.log(bullets[index].position);
          bullets[index].position.add(bullets[index].velocity);
      } */

    if (player.canShoot <= 0) {
        // creates a bullet as a Mesh object
        let bullet = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshPhongMaterial({ color: 0xffffff })
        );

        bullet.scale.set(0.1, 0.1, 0.1);


        const green = 'color:green;';
        const red = 'color:red;';
        let text = "Bullet\nx:" + camera.position.x + "\ny:" + camera.position.y + "\nz:" + camera.position.z;
        console.log("%c%s", green, text);
        text = "Intersect\nx:" + pos.x + "\ny:" + pos.y + "\nz:" + pos.z;
        console.log("%c%s", red, text);

        bullet.position.set(camera.position.x, camera.position.y, camera.position.z);



        // set the velocity of the bullet
        bullet.velocity = new THREE.Vector3(pos.x, pos.y, pos.z);

        // after 1000ms, set alive to false and remove from scene and array
        bullet.alive = true;
        setTimeout(function () {
            bullet.alive = false;
            scene.remove(bullet);
        }, 1000);

        if (bullet.velocity === pos) {
            console.log("same");
            bullet.alive = false;
            scene.remove(bullet);
        }

        // add to scene, array, and set the delay to 10 frames
        bullets.push(bullet);
        scene.add(bullet);
        player.canShoot = 10;
    }
    if (player.canShoot > 0) player.canShoot -= 1;
}

/**
 * Gives the bullets velocity
 */
function moveBullets() {
    for (let index = 0; index < bullets.length; index += 1) {
        if (bullets[index] === undefined) continue;
        if (bullets[index].alive === false) {
            bullets.splice(index, 1);
            continue;
        }
        bullets[index].position.add(bullets[index].velocity);
    }
}

/**
 * Shoots balls when spacebar is pressed down.
 * @param camera
 * @param scene
 * @param playerCube
 */
export function shoot(camera, scene, playerCube) {
    raycaster.setFromCamera(rayDirection, camera);

    // calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);

    // let objects;

    moveBullets();

    if (intersects.length > 0) {
        // console.log("intersect");

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.tag === "destroyable") {
                let position = intersects[i].object.position;
                // targeting(scene);

                // console.log(intersects[i].object);

                // jos ammutaan 2s ja sen jälkeen kohde on tähtäimessä, poistetaan kohde
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 2000);
                    //console.log(playerCube);
                    shootAt(scene, camera, position, playerCube);

                }).then(function () {

                    intersects = raycaster.intersectObjects(scene.children);
                    for (let i = 0; i < intersects.length; i++) {
                        if (intersects[i].object.tag === "destroyable") {
                            //targeting(scene);
                            scene.remove(intersects[i].object);
                            // pitäiskö poistaa bulletit ettei ne jää avaruuteen?
                        }
                    }
                });
            }
        }
    }
}

/* // jos halutaan käyttää esim spacebaria ampumiseen
function keyDown(event){
    event.preventDefault();
    keyEvents[event.keyCode] = true;
}

function keyUp(event){
    keyEvents[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
*/