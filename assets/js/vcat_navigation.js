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

function removeFocus() {
    $(".nav-item .nav-link").removeClass("active");
}

function insertHTML(url) {
    $(".htmlContainer").load(url)
}

function addFocus(selector) {
    $(selector).addClass("active");
}