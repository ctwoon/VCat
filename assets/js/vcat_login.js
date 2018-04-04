function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}
var url;
var token = getItem("authToken");
var request = getItem("multi_login_request");
if (token) {
    if (request == 1) {
        $('.slogan').html('Вход в мультиаккаунт (слот 2)');
    } else {
        window.location.href = "main.html";
    }
}
$(".loginButton").click(function() {
    var username = $(".loginName").val();
    var userpass = $(".loginPass").val();
    url = "https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=" + username + "&password=" + encodeURIComponent(userpass) + "&v=5.73&2fa_supported=1";
    if (!useProxy) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = proxyURL+"?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url
    }).done(function(data) {
        if (JSON.parse(data)['access_token']) {
            if (request == 1) {
                setItem("multi_acc_token", JSON.parse(data)['access_token']);
                setItem("multi_acc_userid", JSON.parse(data)['user_id']);
                setItem("multi_login_request", 0);
            } else {
                setItem("authToken", JSON.parse(data)['access_token']);
                setItem("userId", JSON.parse(data)['user_id']);
            }
            window.location.href = 'main.html';
        }
    });
});

$(".saveToken").click(function() {
    $('#loginModal').modal('hide');
    $('#captchaModal').modal('hide');
    $('#saveModal').modal('show');
});

$(".saveToken2").click(function() {
    var token = $(".token").val();
    setItem("authToken", token);
    $('#saveModal').modal('hide');
    window.location.href = 'main.html';
});
