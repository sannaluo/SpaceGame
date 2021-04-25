import * as THREE from '/three.js-dev/build/three.module.js';

//
// variables
//

//bullet vars
let bullets = [];
let timeElapsed = 0;

//raycaster vars
let raycaster = new THREE.Raycaster();
let raycastPos = new THREE.Vector3();
let raycastDir = new THREE.Vector3();
let raycastRange = 5;

let arrowHelper = new THREE.ArrowHelper()

//crosshair vars init
const crosshairMap = new THREE.TextureLoader().load('/textures/crosshair.png');
const crosshairMaterial = new THREE.SpriteMaterial({
    map: crosshairMap,
    depthTest: false
});
let crosshairSprite = new THREE.Sprite(crosshairMaterial);
crosshairSprite.scale.set(0.76, 0.6, 0.7);
//
// functions
//

export const initRaycast = (obj, scene, range) => {
    //init raycaster
    raycastRange = range;
    raycaster.near = 0;
    raycaster.far = raycastRange;

    //init helper arrow
    /*
    arrowHelper.setLength(raycaster.far);
    arrowHelper.setColor(0xff0d20);
    scene.add(arrowHelper);
    */

    //init crosshair
    scene.add(crosshairSprite);

    updateRaycast(obj);
};

export const updateRaycast = (obj) => {

    //raycaster
    let shipRotation = new THREE.Quaternion();
    obj.getWorldQuaternion(shipRotation);
    raycastDir = new THREE.Vector3(0, 0, -1).applyQuaternion(shipRotation); //get raycaster direction
    obj.getWorldPosition(raycastPos.applyQuaternion(obj.quaternion)); //get raycaster origin

    raycaster.set(raycastPos, raycastDir);

    //arrow helper
    /*
    arrowHelper.setDirection(raycaster.ray.direction);
    arrowHelper.position.copy(raycaster.ray.origin);
    */

    //crosshair position to raycast point
    crosshairSprite.position.copy(raycaster.ray.direction).multiplyScalar(raycastRange);
    crosshairSprite.position.add(raycaster.ray.origin);
};

export const createBullet = (player, scene, camera) => {
    //create 3d object
    const geometry = new THREE.BoxGeometry(0.3, 0.06, 0.2);
    let material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    material.transparent = true;
    material.opacity = 0.8;
    let bullet = new THREE.Mesh(geometry, material);

    //match position and rotation with player
    player.getWorldPosition(bullet.position);
    player.getWorldQuaternion(bullet.quaternion);

    //set destination vector to where player is facing at camera far distance
    let dest = new THREE.Vector3();
    dest.copy(raycaster.ray.direction).multiplyScalar(camera.far + 5);
    dest.add(raycaster.ray.origin);
    bullet.velocity = dest;

    bullets.push(bullet);
    scene.add(bullet);
};

const deleteBullet = (index, scene) => {
    //deletes bullet from bullets array and scene
    scene.remove(bullets[index]);
    //bullets.splice(index);
}

export const moveBullets = (delta, scene) => {
    for (let [index, bullet] of bullets.entries()) {
        //calculate distance from target

        let target = new THREE.Vector3();
        target.copy(bullet.velocity);

        let currentPos = new THREE.Vector3();
        currentPos.copy(bullet.position);

        if (currentPos.distanceTo(target) > 1 || currentPos.distanceTo(target) < -1) {

            //.multiplyScalar(camera.far / raycastRange)
            bullet.position.lerp(target, delta * 0.4);
        } else {  
            deleteBullet(index, scene);
        }

    }
};

export const shoot = (delta, firerate, player, scene, camera) => {

    if (timeElapsed >= firerate ) {
        createBullet(player, scene, camera);
        timeElapsed = 0;
    } else {
        timeElapsed += delta;
    };
};