import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "no-buy") {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            console.log(tabs)
            chrome.tabs.remove(tabs[0].id);
        });
    }
});

console.log("background loaded");