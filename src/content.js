main();

function main() {
    // Assume there is only one video element on the HTML page, since querySelector returns the first video.
    const mediaStream = document.querySelector("video");

    // If there is no video available on this page then do nothing
    if (!mediaStream) return;

    // Get a GainNode so that we can change the gain value upon request.
    const gainNode = createGainNodeFromAudioContext(mediaStream);

    // Listen to buttons in popup.html to adjust the volume based on user's input.
    chrome.runtime.onMessage.addListener(function (request) {
            if (request.message === "adjust_volume") {
                console.log(request.value);
                let volumeMultiplier = request.value / 100;
                if (0 <= volumeMultiplier && volumeMultiplier <= 5) {
                    try {
                        gainNode.gain.value = volumeMultiplier;
                    }
                    catch (e){
                        console.log("No video detected.");
                    }
                }
            }
        }
    );
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



