const DEFAULT_VOLUME_PERCENTAGE = 100;

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab){
        if (changeInfo.url){
            chrome.tabs.sendMessage(
                tabId,
                {
                    message: "adjust_volume",
                    value: DEFAULT_VOLUME_PERCENTAGE
                }
            );
        }
    }
);