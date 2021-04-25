import * as THREE from '/three.js-dev/build/three.module.js';
import { GLTFLoader } from '/three.js-dev/examples/jsm/loaders/GLTFLoader.js';

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

const changeMaterials = (mesh, materialInfo, envMap) => {
    for (let material of materialInfo) {
        if (mesh.isMesh && mesh.material.name == material.name) {
            let colorOld = mesh.material.color;
            mesh.material = new THREE.MeshPhysicalMaterial({ color: colorOld });
            /*
            mesh.material.flatShading = material.flatShading;
            mesh.material.roughness = material.roughness;
            mesh.material.clearcoat = material.clearcoat;
            mesh.material.clearcoatRoughness = material.clearcoatRoughness;
            if(material.emissive == "baseColor") {
                mesh.material.emissive = colorOld;
            } else {
                mesh.material.emissive = material.emissive;
            };
            mesh.material.emissiveIntensity = material.emissiveIntensity;
            mesh.material.transmission = material.transmission;
            */
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
                    mesh.material.emissive = material.emissive;
                };
            };
            if (material.hasOwnProperty("emissiveIntensity")) {
                mesh.material.emissiveIntensity = material.emissiveIntensity;
            };
            if (material.hasOwnProperty("transmission")) {
                mesh.material.transmission = material.transmission;
            };
            mesh.material.envMap = envMap;
        }
    }
    return mesh;
};


export const loadModel = (modelPath, object, materialInfo, envMap) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelPath, (gltf) => {
        gltf.scene.traverse((mesh) => {
            if (materialInfo != null) {
                mesh = changeMaterials(mesh, materialInfo, envMap);
            };

/*
            if (o.isMesh && o.material.name == "runko") {
                let colorOld = o.material.color;
                o.material = new THREE.MeshPhysicalMaterial({ color: colorOld });
                o.material.flatShading = false;
                o.material.roughness = 0.8;
                o.material.clearcoat = 0.5;
                o.material.clearcoatRoughness = 0.5;
                o.material.envMap = worldTexture;
            }
            if (o.isMesh && o.material.name == "musta") {

                o.material = new THREE.MeshPhysicalMaterial({ color: 0x222222 });
                o.material.flatShading = false;
                o.material.roughness = 0.8;
                o.material.metalness = 0.2;
                o.material.envMap = worldTexture;
            }
            if (o.isMesh && o.material.name == "lasi") {
                let colorOld = o.material.color;
                o.material = new THREE.MeshPhysicalMaterial({ color: colorOld });
                o.material.emissive = o.material.color;
                o.material.flatShading = false;
                o.material.roughness = 0;
                o.material.emissiveIntensity = 0.5;

                o.material.envMap = worldTexture;
            }
            if (o.isMesh && o.material.name == "moottori") {
                let colorOld = o.material.color;
                o.material = new THREE.MeshPhysicalMaterial({ color: colorOld });
                o.material.emissive = o.material.color;
                o.material.flatShading = false;
                o.material.roughness = 1;
                o.material.emissiveIntensity = 3;
            }*/

        });
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        object.add(gltf.scene);
        object.updateMatrix();
    }, undefined, function (error) {
        console.error(error);
    });
};
