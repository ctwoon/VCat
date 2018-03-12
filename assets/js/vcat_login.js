var url;
var debug = false;
var token = getItem("authToken");
if (token) {
    window.location.href="main.html";
}
$(".loginButton").click(function() {
    var username = $(".loginName").val();
    var userpass = $(".loginPass").val();
    url = "https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=" + username + "&password=" + encodeURIComponent(userpass) + "&v=5.73&2fa_supported=1";
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url
    }).done(function(data) {
        setItem("authToken", JSON.parse(data)['access_token']);
        setItem("userId", JSON.parse(data)['user_id']);
        window.location.href = 'main.html';
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
