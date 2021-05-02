import * as THREE from '../three.js-dev/build/three.module.js';
import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';

const defaults = [
    {
        name: "runko",                  // defaults
        flatShading: false,             // false
        metalness: 0,                   // 0
        roughness: 1,                   // 1
        clearcoat: 0,                   // 0
        clearcoatRoughness: 0,          // 0
        emissive: "black",              // "black"
        emissiveIntensity: 1,           // 1
        transmission: 0,                // 0
    }
];

const changeMaterials = (mesh, materialInfo, envMap = null) => {
    for (let material of materialInfo) {
        if (mesh.isMesh && mesh.material.name == material.name) {
            let colorOld = mesh.material.color;
            mesh.material = new THREE.MeshPhysicalMaterial({ color: colorOld });
            mesh.material.envMap = envMap;

            if (material.hasOwnProperty("color")) {
                if(material.color == "baseColor") {
                    mesh.material.color.setHex(colorOld);
                } else {
                    mesh.material.color.setHex(material.color);
                };
            };
            if (material.hasOwnProperty("flatShading")) {
                mesh.material.flatShading = material.flatShading;
            };
            if (material.hasOwnProperty("metalness")) {
                mesh.material.metalness = material.metalness;
            };
            if (material.hasOwnProperty("roughness")) {
                mesh.material.roughness = material.roughness;
            };
            if (material.hasOwnProperty("clearcoat")) {
                mesh.material.clearcoat = material.clearcoat;
            };
            if (material.hasOwnProperty("clearcoatRoughness")) {
                mesh.material.clearcoatRoughness = material.clearcoatRoughness;
            };
            if (material.hasOwnProperty("emissive")) {
                if(material.emissive == "baseColor") {
                    mesh.material.emissive = colorOld;
                } else {
                    mesh.material.emissive = new THREE.Color(material.emissive);

                };
            };
            if (material.hasOwnProperty("emissiveIntensity")) {
                mesh.material.emissiveIntensity = material.emissiveIntensity;
            };
            if (material.hasOwnProperty("transmission")) {
                mesh.material.transparent = true;
                mesh.material.opacity = 1;
                mesh.material.transmission = material.transmission;
            };
            if (material.hasOwnProperty("envMapIntensity")) {
                mesh.material.envMapIntensity = material.envMapIntensity;
            };
            if (material.hasOwnProperty("opacity")) {
                mesh.material.transparent = true;
                mesh.material.opacity = material.opacity;
            };
        }
    }
    return mesh;
};


export const loadModel = (modelPath, object, materialInfo = null, envMap = null) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelPath, (gltf) => {
        gltf.scene.traverse((mesh) => {
            if (materialInfo != null) {
                mesh = changeMaterials(mesh, materialInfo, envMap);
            };
        });
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        object.add(gltf.scene);
        object.updateMatrix();
    }, undefined, function (error) {
        console.error(error);
    });
};