const mediaStream = document.querySelector("video");

const audioContext = new AudioContext();
const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
const gainNode = audioContext.createGain();

gainNode.gain.value = 1;
mediaElementAudioSourceNode.connect(gainNode);
gainNode.connect(audioContext.destination);

gainNode.gain.value = 0.5;