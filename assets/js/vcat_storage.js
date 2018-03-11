/** VCat LocalStorage Utils + some other utils **/
function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}

// from https://meyerweb.com/eric/tools/dencoder/
function encodeURL() {
    var obj = document.getElementById('dencoder');
    var unencoded = obj.value;
    obj.value = encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
}
function decodeURL() {
    var obj = document.getElementById('dencoder');
    var encoded = obj.value;
    obj.value = decodeURIComponent(encoded.replace(/\+/g,  " "));
}
