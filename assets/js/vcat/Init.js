const VCAT_VERSION = "1.2.0";

logInfo("Main","Welcome to VCat "+VCAT_VERSION+"!");

let offlineMode = getItem('app_offline');
let enlargeText = getItem('app_vk5post');
let proxyURL = getItem('app_proxyurl');
let allowLongpoll = getItem('app_longpoll');
let useProxy = getItem('app_useproxy');
let hideStories = getItem('app_hidestories');
let liteMode = getItem('app_litemode');
let slotUI = 2;
initConfig();

function safeParse(json) {
    try {
        let result = JSON.parse(json);
        return result;
    } catch (e) {
        showLoadError(1000, "Ошибка возвращаемых данных", "Проблема с прокси и/или интернет-соединением.");
        return false;
    }
}

let accountSlot = getItem('VCat.MultiAccount.Slot');
if (!accountSlot) {
    setItem('VCat.MultiAccount.Slot', 1);
    accountSlot = 1;
}
let token;
let user_id;
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
let secondAccountID = getItem('VCat.MultiAccount.Slot2.UserID');
if (!secondAccountID) {
    setItem('VCat.MultiAccount.Slot2.UserID', '');
    secondAccountID = "";
}
let secondAccountToken = getItem('VCat.MultiAccount.Slot2.Token');
if (!secondAccountToken) {
    setItem('VCat.MultiAccount.Slot2.Token', '');
    secondAccountToken = "";
}

getLongpollData();
