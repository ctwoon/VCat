function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}

var token = getItem("authToken");
var user_id = getItem("userId");
if (!token) {
    window.location.href="index.html";
}

function logInfo(tag, msg) {
  console.log(tag+": "+msg);
}

function logWarn(tag, msg) {
  console.warn(tag+": "+msg);
}

function logError(tag, msg) {
  console.error(tag+": "+msg);
}
logInfo("Auth", "User auth completed!");
