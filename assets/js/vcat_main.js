/** Init **/
// Use my proxy. If set to false, project's root proxy is used.
var debug = true;

var theme = getItem('config_theme');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    theme = 'assets/themes/darkMaterial.css';
}
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: themeName
    }).appendTo("head");
}

/** Storage **/

function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}

var token = getItem("authToken");
var user_id = getItem("userId");
if (!token) {
    window.location.href="index.html";
}
var ab = false;
/** News section **/
function getNews(attr) {
    var url;
    if (typeof attr === "undefined") {
        url = "https://api.vk.com/method/execute.getNewsfeedSmart?access_token="+token+"&filters=post&v=5.68&app_package_id=com.vkontakte.android";
    } else {
        url = "https://api.vk.com/method/execute.getNewsfeedSmart?access_token="+token+"&filters=post&v=5.68&app_package_id=com.vkontakte.android&start_from="+attr;
    }
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url,
        success: function( response ) {
           // console.log(response);
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                if (value['marked_as_ads'] === 0) {
                    if (value['text'].length !== 0) {
                        var cardAttachments = '<p class="card-text">';
                        $.each(value['attachments'], function (index, value) {
                            var type = value['type'];
                            //cardAttachments += '<p>Attachment Type: '+type+'</p>';
                            switch (type) {
                                case 'link':
                                    cardAttachments += '<p><a href="' + value['link']['url'] + '">' + value['link']['url'] + '</a></p>';
                                    break;
                                case 'photo':
                                    cardAttachments += '<p><img src="' + value['photo']['photo_604'] + '"></p>';
                                    break;
                                case 'doc':
                                    if (value['doc']['ext'] === "gif") {
                                        cardAttachments += '<p><img src="' + value['doc']['url'] + '"></p>';
                                        break;
                                    }
                                    var size = value['doc']['size'] / 1000 / 1000;
                                    cardAttachments += '<p><a href="' + value['doc']['url'] + '">' + value['doc']['title'] + ' (размер: '+size+'MB)</a></p>';
                                    break;
                                case 'poll':
                                    cardAttachments += '<p>Голосование: '+value['poll']['question']+' ('+value['poll']['votes']+' голосов)</p>';
                                    $.each(value['poll']['answers'],function(index, value) {
                                        cardAttachments += '<p>- '+value['text']+' ('+value['votes']+' голосов) ['+value['rate']+'%]</p>';
                                    });
                                    break;
                                case 'audio':
                                    var durMin = Math.floor(value['audio']['duration'] / 60);
                                    var durSec = value['audio']['duration'] - durMin*60;
                                    cardAttachments += '<p>Аудиозапись: '+value['audio']['title']+' от '+value['audio']['artist']+' ['+durMin+':'+durSec+']</p>';
                                break;
                                case 'video':
                                    var durMin = Math.floor(value['video']['duration'] / 60);
                                    var durSec = value['video']['duration'] - durMin*60;
                                    cardAttachments += '<p>Видеозапись: '+value['video']['title']+' (ID: '+value['video']['id']+') ['+durMin+':'+durSec+']</p>';
                                    break;
                                default:
                                    cardAttachments += '<p>Неподдерживаемый тип вложения: '+type+'</p>';
                                    break;
                            }
                            //cardAttachments += '<p>===</p>';
                        });
                        cardAttachments += '</p>';
                        var b = getGroupID(Math.abs(value['source_id']), result['response']);
                        var text = value['text'].replace(/(?:\r\n|\r|\n)/g, '<br>');
                        var comment = "";
                        if (value.hasOwnProperty('activity')) {
                            if (value['activity']['type'] === "comment") {
                                comment = '<p class="card-text comment">Последний комментарий: ' + value['activity']['comment']['text'] + '</p>\n'
                            }
                        }
                        var views = value['views']['count'];
                        if (views > 1000) {
                            views = views / 1000;
                            views = views.toFixed(1);
                            views = views + "K";
                        }
                        $('.cardContainer').append('<div class="card cardDecor semi-transparent">\n' +
                            '    <div class="card-body">\n' +
                            '        <h5 class="card-title">' + b + '</h5>\n' +
                            '        <p class="card-text">' + text + '</p>\n' +
                            cardAttachments +
                            '        <p class="card-text"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + views + '</p>\n' +
                            '    </div>\n' +
                            comment +
                            '</div>');
                    }
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            var nextID = result['response']['next_from'];
            $('.cardContainer').attr('vcat-next', nextID);
            initOnScroll();
        }
    });
}

function initOnScroll() {
    if (ab === false) {
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                getNews($('.cardContainer').attr('vcat-next'));
            }
        });
        ab = true;
    }
}

function getGroupID(source_id,json) {
    var result;
    $.each(json['groups'],function(index, value){
        if (value['id'] === source_id) {
            result = value['name'];
            return false;
        }
    });
    if (typeof result === "undefined") {
        $.each(json['profiles'],function(index, value){
            if (value['id'] === source_id) {
                result = value['first_name']+' '+value['last_name'];
                return false;
            }
        });
    }
    return result;
}
/** Navigation section **/
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
/** Config section **/
function getThemesInConfig() {
    $.getJSON("assets/themes.json", function (json) {
        var currentTheme = getItem('config_theme');
        $.each(json['officalThemes'], function (index, value) {
            var isApply = "";
            if (value['themePath'] == currentTheme) {
                isApply = " (установлено)";
            }
            $(".themePlace").append(
                "<div vcat-themePath=\"" + value['themePath'] + "\" class=\"card cardDecor semi-transparent themeSwitch\">\n" +
                " <div class=\"card-body\">\n" +
                " <p class=\"card-text\">\n" +
                value['themeName'] + isApply +
                " </p>\n" +
                " <p class=\"card-text\">\n" +
                value['themeDescription'] +
                " </p>\n" +
                " <p class=\"card-text\">\n<i>От " +
                value['themeAuthor'] +
                " </i></p>\n" +
                " </div>\n" +
                " </div>"
            )
        });

        $(".themeSwitch").click(function () {
            var themePath = $(this).attr('vcat-themePath');
            setItem('config_theme', themePath);
            bootbox.confirm({
                message: "Тема установлена. Для применения изменений перезагрузите страницу.",
                buttons: {
                    confirm: {
                        label: 'Перезагрузить',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Позже',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        window.location.href = "main.html";
                    }
                }
            });
        });
    });
}
/** Friends section */
function getFriends() {
    var url;
    url = "https://api.vk.com/method/friends.get?user_id="+user_id+"&access_token="+token+"&v=5.73&order=hints&fields=photo_100&count=9000&offset=0";
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    console.log(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                $('.cardContainer').append('<div class="card cardDecor semi-transparent">\n' +
                    '    <div class="card-body">\n' +
                    '        <img class="friendFloat" src="'+value['photo_100']+'">' +
                    '        <p class="card-text">' + value['first_name'] + ' ' + value['last_name'] + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
        }
    });
}
