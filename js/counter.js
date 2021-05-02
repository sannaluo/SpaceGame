/**
 * https://discourse.threejs.org/t/be-solved-how-to-find-objects-return-an-array/6685/2
 */

import * as THREE from '/three.js-dev/build/three.module.js';


// ois voinu kans käyttää spritee mut sen position oli vaikee määritellä ku kamera liikkuu
//const counterSprite = new THREE.Sprite( material );


/**
 * Finds objects with given tag, returns a list
 * @param tag
 * @param result
 * @returns {*}
 */
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

/**
 * Changes the inner text of counter element
 * @param objects
 */
function displayDestroyableObjects(objects) {

    let amount = 0;

    for(let i = 0; i < objects.length; i++) {
        amount += 1;
    }

    //console.log(amount);

    document.getElementById("counter").innerText = "Meteors left to destroy: \n" + amount.toString();

    if(amount === 0) {
        document.getElementById("counter").innerText = "You have destroyed all meteors!";
    }

}

/**
 * Main function
 * @param scene
 */
export function countDestroyableObjects(scene) {
    let objects = [];
    scene.getObjectsByTag( 'destroyable', objects ); // the found objects are written in the given array
    //console.log(objects);
    displayDestroyableObjects(objects );

}