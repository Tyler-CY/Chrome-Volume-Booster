// Gain Node controls the volume of the Media Stream
let gainNode;

// Add a listener to initialize gainNode and adjust volume
chrome.runtime.onMessage.addListener(function (request) {
        if (request.message === "adjust_volume") {

            gainNode = gainNode || firstTimeSetUp();

            console.log(request.value);
            let volumeMultiplier = request.value / 100;
            if (0 <= volumeMultiplier && volumeMultiplier <= 5) {
                gainNode.gain.value = volumeMultiplier;
            }
        }
    }
);

function firstTimeSetUp() {
    // Assume there is only one video element on the HTML page, since querySelector returns the first video.
    const mediaStream = document.querySelector("video");

    // Get a GainNode so that we can change the gain value upon request.
    const gainNode = createGainNodeFromAudioContext(mediaStream);

    return gainNode;
}

function createGainNodeFromAudioContext(mediaStream) {
    // Create an AudioContext.
    const audioContext = new AudioContext();
    // Create a MediaElementAudioSourceNode and feed the media stream into it.
    const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
    // Create a GainNode to adjust volume.
    const gainNode = audioContext.createGain();

    // Reset the default gain to 1 (Default is 1 and range is (-inf, inf)).
    gainNode.gain.value = 1;

    // Connect the MediaElementAudioSourceNode to the gainNode and the gainNode to the audio destination
    // (the final destination of the audio in the context, i.e. a physical speaker or headset etc.).
    mediaElementAudioSourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return gainNode;
}



