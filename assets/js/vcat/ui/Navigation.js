switchToPage('.navFeed', 'itemSpinner.html');
location.hash = "feed";

function jumpToEnd() {
    $(document).scrollTop(Math.abs($('.cardContainer').height()));
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

$(".logoutButton").click(function() {
    setItem('authToken', '');
    window.location.href = "index.html";
});

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
}

$('.htmlContainer').addClass('noMarginAndPadding');

logInfo("Main", "Navigation loaded");
