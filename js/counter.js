/**
 * https://discourse.threejs.org/t/be-solved-how-to-find-objects-return-an-array/6685/2
 */

import * as THREE from '/three.js-dev/build/three.module.js';


// ois voinu kans käyttää spritee mut sen position oli vaikee määritellä ku kamera liikkuu
//const counterSprite = new THREE.Sprite( material );



THREE.Object3D.prototype.getObjectsByTag = function( tag, result ) {

    // check the current object
    if ( this.tag === tag ) result.push( this );

    // check children
    for ( let i = 0, l = this.children.length; i < l; i ++ ) {

        let child = this.children[ i ];
        child.getObjectsByTag( tag, result );

    }

    return result;
};


function displayDestroyableObjects(objects, scene, camera) {

    let amount = 0;

    for(let i = 0; i < objects.length; i++) {
        amount += 1;
    }

    //console.log(amount);

    document.getElementById("counter").innerText = "Objects left to destroy: \n" + amount.toString();

    if(amount === 0) {
        document.getElementById("counter").innerText = "You have destroyed all objects!";
    }

}


export function countDestroyableObjects(scene, camera) {
    let objects = [];
    scene.getObjectsByTag( 'destroyable', objects ); // the found objects are written in the given array
    //console.log(objects);
    displayDestroyableObjects(objects, scene, camera);

}

