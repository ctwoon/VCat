switchToPage('.navHome', 'itemMain.html');

function jump(h) {
    var url = location.href;
    location.href = "#"+h;
    history.replaceState(null,null,url);
};

function removeScrollFocus() {
  ab = false;
  $(window).off("scroll", newsScrollHandler);
};

function switchToPage(dom, html) {
  removeFocus();
  removeScrollFocus();
  addFocus(dom);
  insertHTML('items/'+html);
};

$(".navHome").click(function() {
  switchToPage('.navHome', 'itemMain.html');
});

$(".navDiscover").click(function() {
    switchToPage('.navDiscover', 'itemDiscover.html');
});

$(".navPage").click(function() {
    switchToPage('.navPage', 'itemPage.html');
});

$(".navConfig").click(function() {
  switchToPage('.navConfig', 'itemConfig.html');
});

$(".navAbout").click(function() {
  switchToPage('.navAbout', 'itemAbout.html');
});

$(".navFriends").click(function() {
  switchToPage('.navFriends', 'itemFriends.html');
});

$(".navMsg").click(function() {
  switchToPage('.navMsg', 'itemMessages.html');
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

// This may fix some navbar bugs
var noscroll = document.getElementById('noscroll');

noscroll.addEventListener('touchmove', function(e) {

    e.preventDefault();

}, false);

logInfo("Main", "Navigation loaded");
