const VOLUME_KEY = "volume_key";
const DEFAULT_VOLUME_PERCENTAGE = 100;
let currentVolumePercentage;

// Gain Node controls the volume of the Media Stream
let gainNode;


initializeCurrentVolumePercentage();
initializeRequestListeners();

console.log("Now volume: " + currentVolumePercentage);


/**
 * Helper Functions
 */
function initializeCurrentVolumePercentage() {
    currentVolumePercentage = sessionStorage.getItem(VOLUME_KEY);

    console.log("Saved volume: " + currentVolumePercentage);

    // if null, then set as default value and store in localstorage
    if (currentVolumePercentage == null) {
        currentVolumePercentage = DEFAULT_VOLUME_PERCENTAGE;
        sessionStorage.setItem(VOLUME_KEY, String(currentVolumePercentage));
    }
    // Do casting here after checking for null.
    currentVolumePercentage = Number(currentVolumePercentage);

    console.log("Updated volume: " + currentVolumePercentage);
}


/**
 * Add a listener to initialize gainNode and adjust volume
 */
function initializeRequestListeners() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log(request.message);
            if (request.message === "adjust_volume") {
                adjustVolume();
            }
            if (request.message === "save_volume"){
                currentVolumePercentage = Number(request.value);
                sessionStorage.setItem(VOLUME_KEY, currentVolumePercentage);
            }
            if (request.message === "get_volume"){
                sendResponse(currentVolumePercentage);
            }
            if (request.message === "reset_volume"){
                resetVolume();
                adjustVolume();
            }
            if (request.message === "restore_volume"){
                setTimeout(function(){
                    gainNode = gainNode || firstTimeSetUp();

                    if (gainNode) {
                        let volumeMultiplier = Number(sessionStorage.getItem(VOLUME_KEY)) / 100;
                        if (0 <= volumeMultiplier && volumeMultiplier <= 5) {
                            gainNode.gain.value = volumeMultiplier;
                        }
                    }
                }, 150)

            }
            if (request.message === "debug") {
                console.log(request.value);
            }
        }
    );
}

/**
 * Adjust volume
 */
function adjustVolume(){
    gainNode = gainNode || firstTimeSetUp();

    if (gainNode) {
        console.log("Volume changed: " + currentVolumePercentage);
        let volumeMultiplier = currentVolumePercentage / 100;
        if (0 <= volumeMultiplier && volumeMultiplier <= 5) {
            gainNode.gain.value = volumeMultiplier;
        }
    }
}

/**
 * Resets the VOLUME_KEY of the current tab's sessionStorage to default value.
 */
function resetVolume(){
    sessionStorage.setItem(VOLUME_KEY, String(DEFAULT_VOLUME_PERCENTAGE));
    currentVolumePercentage = DEFAULT_VOLUME_PERCENTAGE;
}

/**
 * Sets up the gain node for the first time.
 * @returns {null|GainNode}
 */
function firstTimeSetUp() {
    // Assume there is only one video element on the HTML page, since querySelector returns the first video.
    const mediaStream = document.querySelector("video");

    if (!mediaStream) {
        return null;
    }

    // Get a GainNode so that we can change the gain value upon request.
    const gainNode = createGainNodeFromAudioContext(mediaStream);

    return gainNode;
}

/**
 * Creates a gain node from the media stream
 * @param mediaStream - a Media Stream class
 * @returns {GainNode} - a Gain Node
 */
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



