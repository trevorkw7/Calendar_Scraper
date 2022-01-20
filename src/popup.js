function test() {
  console.log('test')
}
function handleClick (e) {
  e.preventDefault();
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id, allFrames: true},
        files: ['extraction.js'],
    });
   
  })
}

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('popup-button')
  button.addEventListener('click', handleClick)
});