const mediaStream = document.querySelector("video");

const audioContext = new AudioContext();
const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
const gainNode = audioContext.createGain();

gainNode.gain.value = 1;
mediaElementAudioSourceNode.connect(gainNode);
gainNode.connect(audioContext.destination);

chrome.runtime.onMessage.addListener(function (request) {
        if (request.message === "adjust_volume") {
            console.log(request.value);
            let volumeMultipler = request.value / 100;
            if (0 <= volumeMultipler && volumeMultipler <= 5){
                gainNode.gain.value = volumeMultipler;
            }
        }
    }
);