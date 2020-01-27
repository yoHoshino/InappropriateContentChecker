chrome.extension.onRequest.addListener(function (req, sender, res) {
    processImage(req.url);
});

function processImage(sourceUrl) {
    console.log('background.js sourceUrl : ' + sourceUrl);

    if (!sourceUrl.isImageUrl()) return;

    const endpoint = 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.1/analyze';

    const subscriptionKey = '';
    if (!subscriptionKey) {
        throw new Error('Set your environment variables for your subscription key and endpoint.');
    }

    const header = {
        'Content-Type': "application/json",
        'Ocp-Apim-Subscription-Key': subscriptionKey
    };

    const url = new URL(endpoint);
    url.searchParams.append('visualFeatures', 'Adult')
    url.searchParams.append('details', '')
    url.searchParams.append('language', 'ja')

    const payload = {
        url: sourceUrl
    };

    console.log('header: ' + header.toString());
    console.log('url: ' + url.toString());
    console.log('payload: ' + payload.toString());

    fetch(url.toString(),
        {
            headers: header,
            method: "POST",
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(json => showDialogIfInappropriate(json))
        .catch(errorMessage => alert(errorMessage));
}

function showDialogIfInappropriate(object) {
    console.log('showDialogIfInappropriate: ' + JSON.stringify(object, null, 2));

    const content = object.adult;
    if (content.isAdultContent || content.isRacyContent || content.isGoryContent) {
        alert('安心できませんよ!!!!!!');
    }
}

/**
 * Computer Vision API v2.1にてサポートしている画像形式か判定する。
 *
 * Computer Vision API - v2.1 のReferenceはこちら
 * https://westus.dev.cognitive.microsoft.com/docs/services/5cd27ec07268f6c679a3e641/operations/56f91f2e778daf14a499f21b
 *
 * @returns {boolean}
 */
String.prototype.isImageUrl = function () {
    return !!(
        this.endsWith('.jpg') |
        this.endsWith('.png') |
        this.endsWith('.gif') |
        this.endsWith('.bmp')
    );
};
