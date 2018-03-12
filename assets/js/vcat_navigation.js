removeFocus();
addFocus('.navHome');
insertHTML('itemMain.html');

$(".navHome").click(function() {
    removeFocus();
    addFocus('.navHome');
    insertHTML('itemMain.html');
});

$(".navConfig").click(function() {
    removeFocus();
    addFocus('.navConfig');
    insertHTML('itemConfig.html');
});

$(".navAbout").click(function() {
    removeFocus();
    addFocus('.navAbout');
    insertHTML('itemAbout.html');
});

$(".navFriends").click(function() {
    removeFocus();
    addFocus('.navFriends');
    insertHTML('itemFriends.html');
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
