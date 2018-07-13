var debugInfo = true;
const VCAT_VERSION = "0.9.7c";

logInfo("Main","Welcome to VCat "+VCAT_VERSION+"!");

var offlineMode = getItem('app_offline');
var enlargeText = getItem('app_vk5post');
var proxyURL = getItem('app_proxyurl');
var allowLongpoll = getItem('app_longpoll');
var useProxy = getItem('app_useproxy');
var darkMode = getItem('app_darkmode');
var liteMode = getItem('app_litemode');
var slotUI = 2;
initConfig();

function safeParse(json) {
    try {
        var result = JSON.parse(json);
        return result;
    } catch (e) {
        showLoadError(1000, "Ошибка возвращаемых данных", "Проблема с прокси и/или интернет-соединением.");
        return false;
    }
}

var accountSlot = getItem('VCat.MultiAccount.Slot');
if (!accountSlot) {
    setItem('VCat.MultiAccount.Slot', 1);
    accountSlot = 1;
}
var token;
var user_id;
if (accountSlot == 2) {
    token = getItem("VCat.MultiAccount.Slot2.Token");
    user_id = getItem("VCat.MultiAccount.Slot2.UserID");
    slotUI = 1;
} else {
    token = getItem("VCat.Auth.Token");
    user_id = getItem("VCat.Auth.UserID");
}

if (!token) {
    window.location.href = "index.html";
}
$('.navSwitchAccount').html("К аккаунту "+slotUI);
$('.navSwitchAccountPC').html("<i data-feather=\"user-plus\"></i>К аккаунту "+slotUI);

console.log('MultiAccount', 'Slot: '+accountSlot);
var secondAccountID = getItem('VCat.MultiAccount.Slot2.UserID');
if (!secondAccountID) {
    setItem('VCat.MultiAccount.Slot2.UserID', '');
    secondAccountID = "";
}
var secondAccountToken = getItem('VCat.MultiAccount.Slot2.Token');
if (!secondAccountToken) {
    setItem('VCat.MultiAccount.Slot2.Token', '');
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
