const elements = document.querySelectorAll('a');

for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('mouseover', function (event) {
        console.log('mouseover!!:' + this.href);
        chrome.extension.sendRequest({"url": this.href});
    });
}
