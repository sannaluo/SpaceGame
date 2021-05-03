import * as THREE from '../three.js-dev/build/three.module.js';

let currentsound;

export const playMusic = (camera, source, loop = false) => {

// create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add( listener );

// create a global audio source
    const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( './sounds/'+source+'.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( loop );
        sound.setVolume( 0.5 );
        sound.play();
    });

    if(loop === true) {
        currentsound = sound;
    }


};

export const stopMusic = () => {
    currentsound.stop();
};

