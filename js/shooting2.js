import * as THREE from '../three.js-dev/build/three.module.js';
import { loadModel } from '../js/modelLoader.js';
import { TWEEN } from '../three.js-dev/examples/jsm/libs/tween.module.min.js'
import { destroyables } from '../js/particles.js';
import {playMusic} from "../js/music.js";

//
// variables
//


//bullet vars
let bullets = [];
let timeElapsed = 0;

//raycaster vars
let raycaster = new THREE.Raycaster();
let attackStartPos = new THREE.Vector3();
let attackDir = new THREE.Vector3();
let attackRange = 5;

let arrowHelper = new THREE.ArrowHelper()

//crosshair vars init
const crosshairMap = new THREE.TextureLoader().load('./textures/crosshair2.png');
const crosshairMaterial = new THREE.SpriteMaterial({
    map: crosshairMap,
    depthTest: false
});
let crosshairSprite = new THREE.Sprite(crosshairMaterial);
crosshairSprite.scale.set(1.5, 1.5, 0.7);
//
// functions
//




export const initRaycast = (obj, scene, range, camera) => {
    //init raycaster
    raycaster.setFromCamera(new THREE.Vector2(), camera);
    attackRange = range;
    raycaster.near = 0;
    raycaster.far = attackRange;

    //init helper arrow

    //arrowHelper.setLength(raycaster.far);
    //arrowHelper.setColor(0xff0d20);
    //scene.add(arrowHelper);


    //init crosshair
    scene.add(crosshairSprite);

    updateRaycast(obj);
};

export const updateRaycast = (obj) => {
    //set attack start and direction
    let shipRotation = new THREE.Quaternion();
    obj.getWorldQuaternion(shipRotation);
    attackDir = new THREE.Vector3(0, 0, -1).applyQuaternion(shipRotation); //get attack direction
    obj.getWorldPosition(attackStartPos.applyQuaternion(obj.quaternion)); //get attack start
    raycaster.set(attackStartPos, attackDir);

    //arrow helper
    //arrowHelper.setDirection(raycaster.ray.direction);
    //arrowHelper.position.copy(raycaster.ray.origin);


    //crosshair position to raycast point
    crosshairSprite.position.copy(attackDir).multiplyScalar(attackRange);
    crosshairSprite.position.add(attackStartPos);
};

export const createBullet = (player, scene, camera) => {
    //create 3d object
    const geometry = new THREE.BoxGeometry(0.3, 0.06, 0.2);
    let material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
    material.transparent = true;
    material.opacity = 0;
    let bullet = new THREE.Mesh(geometry, material);


    loadModel('./models/laser.gltf', bullet, [{
        name: "laser",
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 22,
    },{
        name: "reuna",
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 20,

    }]);

    //match position and rotation with player
    player.getWorldPosition(bullet.position);
    player.getWorldQuaternion(bullet.quaternion);

    //set destination vector to where player is facing at camera far distance
    let dest = new THREE.Vector3();
    dest.copy(attackDir).multiplyScalar(camera.far + 5);
    dest.add(attackStartPos);
    bullet.velocity = dest;

    bullets.push(bullet);
    scene.add(bullet);
};

const deleteBullet = (index, scene) => {
    scene.remove(bullets[index]);
};

const deleteDestroyable = (index, scene) => {
    scene.remove(destroyables[index]);
};

export const moveBullets = (delta, scene) => {
    for (let [indexB, bullet] of bullets.entries()) {

        //calculate distance from target
        let target = new THREE.Vector3();
        target.copy(bullet.velocity);

        let currentPos = new THREE.Vector3();
        currentPos.copy(bullet.position);

        if (currentPos.distanceTo(target) > 1 || currentPos.distanceTo(target) < -1) {
            bullet.position.lerp(target, delta * 0.1);
        } else {
            deleteBullet(indexB, scene);
        };

        for (let [indexD, destroyable] of destroyables.entries()) {
            if (currentPos.distanceTo(destroyable.position) < 0.5 && currentPos.distanceTo(destroyable.position) > -0.5) {
                if(destroyable.parent === scene) {
                    deleteBullet(indexB, scene);
                }
                deleteDestroyable(indexD, scene);
               // console.log(destroyables);
            }
        }
    };
};

export const shoot = (delta, firerate, player, scene, camera) => {

    const rayIntersects = raycaster.intersectObjects(scene.children, true);
    for (let intersection of rayIntersects) {
        if (intersection.object.tag === "destroyable") {
            if (timeElapsed >= firerate) {

                createBullet(player, scene, camera);

                playMusic(camera, 'laser-pew');

                timeElapsed = 0;
            } else {
                timeElapsed += delta;
            };
        };
    };
};

