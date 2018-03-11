var url;
$(".loginButton").click(function() {
    var username = $(".loginName").val();
    var userpass = $(".loginPass").val();
    url = "https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=" + username + "&password=" + userpass + "&v=5.73&2fa_supported=1";
	url = "http://vcatclient.000webhostapp.com/proxy.php?url="+encodeURIComponent(url).replace(/'/g,"%27").replace(/"/g,"%22");
    $.ajax({
        url: url
    }).done(function(data) {
        setItem("authToken", JSON.parse(data)['access_token']);
        window.location.href = 'main.html';
    });
/**
	$('.loginLink').attr('href', url);
    $('.loginLink').html('Перейти! (в новой вкладке)');
    $('#loginModal').modal();**/
});

/**$(".captchaOpen").click(function() {
    $('#loginModal').modal('hide');
    $('#captchaModal').modal('show');
    $('.captchaImage').hide();
    $('.captchaKey').hide();
    $('.captchaLink').hide();
});

$(".captchaGet").click(function() {
    $('.captchaImage').attr('src', $('.captchaURL').val());
    $('.captchaImage').show();
    $('.captchaKey').show();
});

$(".captchaGetURL").click(function() {
    var key = $(".captchaKey").val();
    var sid = $(".captchaID").val();
    var aurl = url + encodeURIComponent("&captcha_sid="+sid+"&captcha_key="+key);
    $('.captchaLinkReal').attr('href', aurl);
    $('.captchaLinkReal').html('Перейти! (в новой вкладке)');
    $('.captchaLink').show();
}); **/

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