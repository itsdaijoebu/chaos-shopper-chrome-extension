import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

// default values for variables used throughout extension
chrome.runtime.onInstalled.addListener(() => {
    // Check if the options already exist in local storage
    chrome.storage.local.get(['closeOnCartAdd', 'useAnimations', 'buyPercent'], result => {
      // If the options do not exist, set default values
      if (result.closeOnCartAdd === undefined) {
        chrome.storage.local.set({ closeOnCartAdd: false });
      }
      if (result.useAnimations === undefined) {
        chrome.storage.local.set({ useAnimations: true });
      }
      if (result.buyPercent === undefined) {
        chrome.storage.local.set({ buyPercent: 50 });
      }
    });
  });
  
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === "close-tab") {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            console.log(tabs)
            chrome.tabs.remove(tabs[0].id);
        });
    } else if(request.msg === "close-on-navigation") {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            closeTabOnNavigation(tabs[0].id)
        })
    }
});
function closeTabOnNavigation(tabId) {
    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && (changeInfo.status === "loading" || changeInfo.status === "complete")) {
            chrome.tabs.remove(tabId);
            chrome.tabs.onUpdated.removeListener(listener);
        }
    });
}

console.log("background loaded");