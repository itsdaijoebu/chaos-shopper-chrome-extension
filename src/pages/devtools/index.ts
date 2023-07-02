try {
  chrome.devtools.panels.create(
    "Dev Tools",
    "icon-38.png",
    "src/pages/panel/index.html"
  );
} catch (e) {
  console.error(e);
}
