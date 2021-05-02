import * as THREE from '../three.js-dev/build/three.module.js';
import {loadModel} from '../js/modelLoader.js';

export let destroyables = [];

// creates
export const createStars = (scene) => {
    //ei oo enää pölyy mut en jaksanu vaihtaa muuttujia

    let dustGeometry = new THREE.BufferGeometry();
    let dustMaterials = [];
    let dustVertices = [];
    let dustParticles;

    for (let i = 0; i < 150000; i++) {

        const x = THREE.MathUtils.randFloatSpread(1);
        const y = THREE.MathUtils.randFloatSpread(1);
        const z = THREE.MathUtils.randFloatSpread(1);

        dustVertices.push(x, y, z);
    }
    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
    const dustParameters = [
        [0xFFFBAE, 0.047],
        [0xFFCEAE, 0.023],
        [0xFFE3AE, 0.056],
        [0xFFF9AE, 0.019],
        [0xFFF2AE, 0.011]
    ];

    for (let i = 0; i < dustParameters.length; i++) {

        const color = dustParameters[i][0];
        const size = dustParameters[i][1];

        dustMaterials[i] = new THREE.PointsMaterial({ size: size, blending: THREE.AdditiveBlending, depthTest: true });
        dustMaterials[i].color.setHex(color,);

        dustParticles = new THREE.Points(dustGeometry, dustMaterials[i]);

        dustParticles.rotation.x = Math.random() * 6;
        dustParticles.rotation.y = Math.random() * 6;
        dustParticles.rotation.z = Math.random() * 6;
        dustParticles.scale.x = 1500;
        dustParticles.scale.y = 1500;
        dustParticles.scale.z = 1500;
        scene.add(dustParticles);
    }
};


export const createDestroyables = (scene) => {
    // test cube in front of camera
    const geometry = new THREE.BoxGeometry(0.7, 0.5, 0.7);
    let material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
    material.transparent = true;
    material.opacity = 0;

    for (let i = 0; i < 30; i++) {
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = THREE.MathUtils.randFloatSpread(50) + 5;
        mesh.position.y = THREE.MathUtils.randFloatSpread(50) + 5;
        mesh.position.z = THREE.MathUtils.randFloatSpread(50) + 5;

        mesh.scale.x = THREE.MathUtils.randFloatSpread(0.5) + 1.8;
        mesh.scale.y = THREE.MathUtils.randFloatSpread(0.5) + 1.8;
        mesh.scale.z = THREE.MathUtils.randFloatSpread(0.5) + 1.8;

        mesh.rotation.x = Math.random();
        mesh.rotation.y = Math.random();
        mesh.rotation.z = Math.random();

        mesh.tag = "destroyable";
        loadModel('./models/asteroid.gltf', mesh,  [{
            name: "Material",
            roughness: 0.8,
            color: 0x505062
        }]);
        mesh.scale.set(1.8,1.8,1.8);
        destroyables.push(mesh);
        scene.add(mesh);
    }
};