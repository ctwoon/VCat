function craftURL(url) {
    if (useProxy == "disabled") {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = proxyURL + "?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    return url;
}

function craftPollURL(url) {
    return craftURL("https://"+url);
}

function craftMethodURL(methodType, methodName, methodParams, apiVersion) {
    return craftURL('https://api.vk.com/method/'+methodType+'.'+methodName+'?access_token='+token+'&'+methodParams+'&v='+apiVersion);
}

async function sendData(methodType, methodName, methodParams, apiVersion, callback, callbackError) {
    let result;
    try {
        result = await $.ajax({
            url: craftMethodURL(methodType, methodName, methodParams, apiVersion),
            type: 'GET'
        });
        callback(JSON.parse(result));
    } catch (error) {
        console.error(error);
        callbackError(JSON.parse(result));
    }
}