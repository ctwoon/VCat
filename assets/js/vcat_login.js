var useProxy = true;
var proxyURL = "https://utkacraft.ru/vcat/proxy.php";
var request = getItem("VCat.MultiAccount.AuthRequest");

function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}
var url;
var token = getItem("VCat.Auth.Token");
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
    url = "https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=" + username + "&password=" + encodeURIComponent(userpass) + "&v=5.73&2fa_supported=1&scope=all&libverify_support=1";
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
                setItem("VCat.MultiAccount.Slot2.Token", JSON.parse(data)['access_token']);
                setItem("VCat.MultiAccount.Slot2.UserID", JSON.parse(data)['user_id']);
                setItem("VCat.MultiAccount.AuthRequest", 0);
            } else {
                setItem("VCat.Auth.Token", JSON.parse(data)['access_token']);
                setItem("VCat.Auth.UserID", JSON.parse(data)['user_id']);
            }
            window.location.href = 'index.html';
        } else {
            var a = JSON.parse(data);
            if (a['error'] == "need_validation") {
                if (a['validation_type'] == "2fa_sms") {
                    $('.slogan').html("На номер "+a['phone_mask']+" отправлен 2FA-код.");
                } else {
                    $('.slogan').html("На приложение для генерации кодов отправлен 2FA-код.");
                }
                $('center').html('<input type="number" id="input2FA" class="form-control semi-transparent login2FA" placeholder="Код из SMS"><button class="btn btn-lg btn-primary btn-block semi-transparent sign-connect loginButton2FA" type="button">Далее</button>');
                $(".loginButton2FA").click(function() {
                    var code = $(".login2FA").val();
                    if (code) {
                        url = "https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=" + username + "&password=" + encodeURIComponent(userpass) + "&v=5.73&2fa_supported=1&scope=all&libverify_support=1&code="+code;
                        if (!useProxy) {
                            url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
                        } else {
                            url = proxyURL+"?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
                        }
                        $.ajax({
                            url: url
                        }).done(function (data) {
                            if (JSON.parse(data)['access_token']) {
                                if (request == 1) {
                                    setItem("VCat.MultiAccount.Slot2.Token", JSON.parse(data)['access_token']);
                                    setItem("VCat.MultiAccount.Slot2.UserID", JSON.parse(data)['user_id']);
                                    setItem("VCat.MultiAccount.AuthRequest", 0);
                                } else {
                                    setItem("VCat.Auth.Token", JSON.parse(data)['access_token']);
                                    setItem("VCat.Auth.UserID", JSON.parse(data)['user_id']);
                                }
                                window.location.href = 'main.html';
                            } else {
                                alert("Неверный 2FA-код или ошибка сервера!");
                            }
                        });
                    } else {
                        alert("Пустой код!");
                    }
                });
            }
            console.log(data);
        }
    });
});

$(".saveToken").click(function() {
    $('#saveModal').modal('show');
});

$(".saveToken2").click(function() {
    var token = $(".token").val();
    var userid = $(".userid").val();
    if (request == 1) {
        setItem("VCat.MultiAccount.Slot2.Token", token);
        setItem("VCat.MultiAccount.Slot2.UserID", userid);
        setItem("VCat.MultiAccount.AuthRequest", 0);
    } else {
        setItem("VCat.Auth.Token", token);
        setItem("VCat.Auth.UserID", userid);
    }
    $('#saveModal').modal('hide');
    window.location.href = 'main.html';
});
