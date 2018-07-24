switchToPage('.navFeed', 'itemSpinner.html');
if (!location.hash) {
    location.hash = "feed";
}

function jumpToEnd(dom) {
    $(document).scrollTop(Math.abs($(dom).height()));
}

function removeScrollFocus() {
  ab = false;
  $(window).off("scroll", newsScrollHandler);
}

function removeDiscoverScrollFocus() {
    ab = false;
    $(window).off("scroll", discoverScrollHandler);
}

function switchToPage(dom, html) {
  removeFocus();
  removeScrollFocus();
  removeDiscoverScrollFocus();
  addFocus(dom);
  insertHTML('items/'+html);
  isInMessages = false;
}

function removeFocus() {
    $(".nav-item .nav-link").removeClass("active");
}

function insertHTML(url) {
    $(".htmlContainer").load(url)
}

function addFocus(selector) {
    $(selector).addClass("active");
}

$(window).on('hashchange', function() {
   parseNavHash();
});

$(window).on('load', function() {
    parseNavHash();
});

function parseNavHash() {
    var hash = window.location.hash;
    hash = hash.substring(1, hash.length);
    // crappy menu, yeah :(
    switch (hash) {
        case 'myPage':
            switchToPage('.navPage', 'itemSpinner.html');
            getCurrentUser();
            break;
        case 'feed':
            switchToPage('.navFeed', 'itemSpinner.html');
            getNews();
            break;
        case 'smartFeed':
            switchToPage('.navDiscover', 'itemSpinner.html');
            getDiscover();
            break;
        case 'msg':
            switchToPage('.navMsg', 'itemSpinner.html');
            getMessageDialogs();
            break;
        case 'friends':
            switchToPage('.navFriends', 'itemSpinner.html');
            getFriends();
            break;
        case 'groups':
            switchToPage('.navGroups', 'itemSpinner.html');
            getGroups();
            break;
        case 'audio':
            switchToPage('.navMusic', 'itemSpinner.html');
            getMusic();
            break;
        case 'config':
            removeFocus();
            removeScrollFocus();
            removeDiscoverScrollFocus();
            addFocus(".navAppConfig");
            $(".cardContainer").html("");
            getSettings();
            break;
        case 'multiSlot':
            switchAccount();
            break;
    }
    // Parse actions
    // [0] always action, [1] always define, [2],[3] are params
    var hash_action = hash.split("_");
    switch (hash_action[0]) {
        case 'msg':
            getMessageDialogs();
            if (hash_action[1] === "chat") {
                let a = null;
                let b = null;
                if (hash_action[3] == 0) {
                    b = hash_action[4];
                } else {
                    a = hash_action[4];
                }
                getMessages(hash_action[2], a, b);
            } else if (hash_action[1] === "im") {
                let a = null;
                let b = null;
                if (hash_action[3] == 0) {
                    b = hash_action[4];
                } else {
                    a = hash_action[4];
                }
                getMessages(hash_action[2], a, b);
            }
            break;
    }
    if (hash.includes("msg_chat_")) {
        hash = hash.substring(9, hash.length);
    }
}

$('.htmlContainer').addClass('noMarginAndPadding');

logInfo("Main", "Navigation loaded");
