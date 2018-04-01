switchToPage('.navHome', 'itemSpinner.html');
getNews();

function jump(h) {
    var url = location.href;
    location.href = "#"+h;
    history.replaceState(null,null,url);
};

function removeScrollFocus() {
  ab = false;
  $(window).off("scroll", newsScrollHandler);
};

function removeDiscoverScrollFocus() {
    ab = false;
    $(window).off("scroll", discoverScrollHandler);
};

function switchToPage(dom, html) {
  removeFocus();
  removeScrollFocus();
  removeDiscoverScrollFocus();
  addFocus(dom);
  insertHTML('items/'+html);
};

$(".navHome").click(function() {
  switchToPage('.navHome', 'itemSpinner.html');
  getNews();
});

$(".navDiscover").click(function() {
    switchToPage('.navDiscover', 'itemSpinner.html');
    getDiscover();
});

$(".navPage").click(function() {
    switchToPage('.navPage', 'itemSpinner.html');
    getCurrentUser();
});

$(".navConfig").click(function() {
  switchToPage('.navConfig', 'itemConfig.html');
});

$(".navAbout").click(function() {
  switchToPage('.navAbout', 'itemAbout.html');
});

$(".navFriends").click(function() {
  switchToPage('.navFriends', 'itemSpinner.html');
  getFriends();
});

$(".navGroups").click(function() {
    switchToPage('.navGroups', 'itemSpinner.html');
    getGroups();
});

$(".navMsg").click(function() {
  switchToPage('.navMsg', 'itemSpinner.html');
  getMessageDialogs();
});

$(".navDebug").click(function() {
  switchToPage('.navDebug', 'itemDebug.html');
});

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

$('.htmlContainer').addClass('noMarginAndPadding');

logInfo("Main", "Navigation loaded");
