/**
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/
 * @see https://developer.chrome.com/docs/extensions/reference/commands/
 * @see https://github.com/GoogleChrome/chrome-extensions-samples
 */

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getSpecificTabs(queryOptions) {
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs;
}

chrome.commands.onCommand.addListener(async function (command) {
  const currentWindow = await chrome.windows.getCurrent();
  const currentTab = await getCurrentTab();
  const currentTabIndex = currentTab.index;
  const specificTabs = await getSpecificTabs({ active: false, pinned: false, windowId: currentWindow.id });
  const tabIds = new Array(specificTabs.length);

  let closeTabIds = null;

  if (command === 'close-other-tabs') {
    closeTabIds = specificTabs.map((tab) => tab.id);
  } else if (command === 'close-right-tabs' || command === 'close-left-tabs') {
    if (command === 'close-right-tabs') {
      closeTabIds = specificTabs.filter((tab) => tab.index > currentTabIndex).map((tab) => tab.id);
      // closeTabIds = specificTabs.slice(currentTabIndex + 1).map(tab => tab.id);
    } else if (command === 'close-left-tabs') {
      closeTabIds = specificTabs.filter((tab) => tab.index < currentTabIndex).map((tab) => tab.id);
    }
  }

  chrome.tabs.remove(closeTabIds);
});
