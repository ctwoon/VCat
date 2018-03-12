var bg = getItem('config_bg');
if (!bg) {
    setItem('config_bg', 0);
    bg = 0;
}
if (bg == 0) {
    $.getJSON("assets/gradients.json", function(json) {
        var item = json[Math.floor(Math.random()*json.length)];
        $('.dynamicBG').css('background', 'linear-gradient(to right, '+item['colors'][0]+', '+item['colors'][1]+')');
    });
}
if (bg == 1) {
    $('.dynamicBG').css('background', 'url("assets/img/bg1.jpg")');
}

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
