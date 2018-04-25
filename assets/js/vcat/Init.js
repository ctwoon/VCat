var debugInfo = true;
const VCAT_VERSION = "0.9.3";

logInfo("Main","Welcome to VCat "+VCAT_VERSION+"!");

var offlineMode = getItem('app_offline');
var enlargeText = getItem('app_vk5post');
var proxyURL = getItem('app_proxyurl');
var allowLongpoll = getItem('app_longpoll');
var useProxy = getItem('app_useproxy');
var darkMode = getItem('app_darkmode');
var slotUI = 2;
initConfig();

var accountSlot = getItem('multi_slot');
if (!accountSlot) {
    setItem('multi_slot', 1);
    accountSlot = 1;
}
var token;
var user_id;
if (accountSlot == 2) {
    token = getItem("multi_acc_token");
    user_id = getItem("multi_acc_userid");
    slotUI = 1;
} else {
    token = getItem("authToken");
    user_id = getItem("userId");
}

if (!token) {
    window.location.href = "index.html";
}
$('.navSwitchAccount').html("К аккаунту "+slotUI);
$('.navSwitchAccountPC').html("<i data-feather=\"user-plus\"></i>К аккаунту "+slotUI);

console.log('MultiAccount', 'Slot: '+accountSlot);
var secondAccountID = getItem('multi_acc_userid');
if (!secondAccountID) {
    setItem('multi_acc_userid', '');
    secondAccountID = "";
}
var secondAccountToken = getItem('multi_acc_token');
if (!secondAccountToken) {
    setItem('multi_acc_token', '');
    secondAccountToken = "";
}
function craftURL(url) {
  if (useProxy == "disabled") {
      url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  } else {
      url = proxyURL + "?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  }
  return url;
}

function craftMusicURL(url,name) {
    if (useProxy == "disabled") {
        url = "proxy.php?method=downloadAudioRequest&name="+name+"&url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = proxyURL + "?method=downloadAudioRequest&name="+name+"&url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    return url;
}

function craftPollURL(url) {
    return craftURL("https://"+url);
}

function craftMethodURL(methodType, methodName, methodParams, apiVersion) {
    return craftURL('https://api.vk.com/method/'+methodType+'.'+methodName+'?access_token='+token+'&'+methodParams+'&v='+apiVersion);
}
getLongpollData();
