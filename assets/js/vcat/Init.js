var debugInfo = true;
const VCAT_VERSION = "0.9";

logInfo("Main","Welcome to VCat "+VCAT_VERSION+"!");

var theme = getItem('config_theme');
var themeName = getItem('config_theme_name');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    setItem('config_theme_name', 'Material Dark');
    theme = 'assets/themes/darkMaterial.css';
}

var offlineMode = getItem('app_offline');
var enlargeText = getItem('app_vk5post');
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
} else {
    token = getItem("authToken");
    user_id = getItem("userId");
}

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

logInfo("ThemeEngine", "Loading theme "+theme);
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: themeName
    }).appendTo("head");
}

function craftURL(url) {
  if (!useProxy) {
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
getLongpollData();
