/** Init **/
// Use my proxy. If set to false, project's root proxy is used.
function logInfo(tag, msg) {
  console.log(tag+": "+msg);
}

function logWarn(tag, msg) {
  console.warn(tag+": "+msg);
}

function logError(tag, msg) {
  console.error(tag+": "+msg);
}

var debug = true;

logInfo("Main","Welcome to VK Kitten 0.7!");

var theme = getItem('config_theme');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    theme = 'assets/themes/darkMaterial.css';
}
logInfo("ThemeEngine", "Loading theme "+theme);
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: themeName
    }).appendTo("head");
}

function craftURL(url) {
  if (!debug) {
      url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  } else {
      url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  }
  return url;
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
logInfo("Auth", "User auth completed!");
var ab = false;
/** News section **/
function getNews(attr) {
    logInfo("Newsfeed", "Get Newsfeed");
    var url;
    if (typeof attr === "undefined") {
        url = "https://api.vk.com/method/execute.getNewsfeedSmart?access_token="+token+"&filters=post&v=5.68&app_package_id=com.vkontakte.android";
    } else {
        url = "https://api.vk.com/method/execute.getNewsfeedSmart?access_token="+token+"&filters=post&v=5.68&app_package_id=com.vkontakte.android&start_from="+attr;
    }
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            //console.log(response);
            var result = JSON.parse(response);
            logInfo("Newsfeed", "Got Newsfeed JSON");
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
                        var isLikedClass="";
                        var isLiked="false";
                        if (value['likes']['user_likes'] == 1) {
                            isLikedClass="text-danger";
                            isLiked=true;
                        }
                        var itemID = value['post_id'];
                        $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard">\n' +
                            '    <div class="card-body">\n' +
                            '        <h5 class="card-title">' + b + '</h5>\n' +
                            '        <p class="card-text">' + text + '</p>\n' +
                            cardAttachments +
                            '        <p class="card-text"><abbr class="likeCount '+isLikedClass+'" vcat-author="'+value['source_id']+'" vcat-postid="'+itemID+'" vcat-isliked="'+isLiked+'"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + '</abbr>&nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + views + '\n' +
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
            $(".likeCount").click(function() {
                var id = $(this).attr('vcat-postid');
                var isLiked = $(this).attr('vcat-isliked');
                var source = $(this).attr('vcat-author');
                if(isLiked == "false") {
                    likePost(id, source);
                    $(this).attr('vcat-isliked', true);
                    $(this).attr('class', 'likeCount text-danger');
                    $(this).contents().filter(function() {
                        return this.nodeType == 3
                    }).each(function(){
                        var cur = parseInt($(this).text());
                        var newt = cur + 1;
                        this.textContent = this.textContent.replace($(this).text().toString(), newt.toString());
                    });
                } else {
                    unlikePost(id, source);
                    $(this).attr('vcat-isliked', false);
                    $(this).attr('class', 'likeCount');
                    $(this).contents().filter(function() {
                        return this.nodeType == 3
                    }).each(function(){
                        this.textContent = this.textContent.replace($(this).text().toString(), $(this).text()-1);
                    });
                }
            });
            logInfo("Newsfeed", "Finish Newsfeed");
        }
    });
}

function likePost(id, source) {
    logInfo("Newsfeed", "Like Post #"+id);
    var url;
    url = "https://api.vk.com/method/likes.add?type=post&item_id="+id+"&access_token="+token+"&owner_id="+source+"&v=5.73";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            //console.log(response);
            //insertHTML('itemMain.html');
        }
    });
}

function unlikePost(id, source) {
    logInfo("Newsfeed", "Unlike Post #"+id);
    var url;
    url = "https://api.vk.com/method/likes.delete?type=post&item_id="+id+"&access_token="+token+"&owner_id="+source+"&v=5.73";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
           // console.log(response);
           // insertHTML('itemMain.html');
        }
    });
}


function initOnScroll() {
    if (ab === false) {
        $(window).scroll(newsScrollHandler);
        ab = true;
    }
}

function newsScrollHandler() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        getNews($('.cardContainer').attr('vcat-next'));
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
switchToPage('.navHome', 'itemMain.html');

function removeScrollFocus() {
  ab = false;
  $(window).off("scroll", newsScrollHandler);
}

function switchToPage(dom, html) {
  removeFocus();
  removeScrollFocus();
  addFocus(dom);
  $('.htmlContainer').removeClass('noMarginAndPadding');
  insertHTML('items/'+html);
}

$(".navHome").click(function() {
  switchToPage('.navHome', 'itemMain.html');
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

logInfo("Main", "Navigation loaded");
/** Config section **/
function getThemesInConfig() {
  logInfo("Config", "Get Themes");
    $.getJSON("assets/themes.json", function (json) {
        var currentTheme = getItem('config_theme');
        logInfo("Config", "Got Themes JSON");
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
            logInfo("Config", "Set Theme to "+themePath);
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

        logInfo("Config", "Finish Themes");
    });
}
/** Friends section */
function getFriends() {
  logInfo("FriendList", "Get FriendList");
    var url = "https://api.vk.com/method/friends.get?user_id="+user_id+"&access_token="+token+"&v=5.73&order=hints&fields=photo_100&count=9000&offset=0";
    url = craftURL(url);
    console.log(url);
    $.ajax({
        url: url,
        success: function( response ) {
          logInfo("FriendList", "Got FriendList JSON");
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
            logInfo("FriendList", "Finish FriendList");
        }
    });
}
/** Messages section */
function getMessageDialogs() {
  $('.htmlContainer').toggleClass('noMarginAndPadding');
  logInfo("DialogList", "Get DialogList");
    var url = "https://api.vk.com/method/execute.getDialogsWithProfilesNewFixGroups?lang=ru&https=1&count=40&access_token="+token+"&v=5.69";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            //$('.cardContainer').append(response);
            var result = JSON.parse(response);
            logInfo("DialogList", "Got DialogList JSON");
            $.each(result['response']['a']['items'],function(index, value){
                var dialogID = value['message']['user_id'];
                var name;
                if (value['message']['title'].length > 0) {
                  // No group chats for now, sorry!
                    /**var isGroup = "(Беседа)";
                    name = value['message']['title'] + " " + isGroup;
                    dialogID = parseInt(dialogID) + 2000000000;
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent showDialog" vcat-dialog="'+dialogID+'">\n' +
                        '    <div class="card-body">\n' +
                        '        <h5 class="card-title noPadding">' + name + '</h5>\n' +
                        '        <p class="card-text">' + value['message']['body'] + '</p>\n' +
                        '        <p class="card-text smallText"> <i>ID: ' + dialogID + '</i></p>\n' +
                        '    </div>\n' +
                        '</div>');*/
                } else {
                    name = getMessageDialogTitle(dialogID, result['response']);
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent showDialog message messageBorder" vcat-username="'+name+'" vcat-dialog="'+dialogID+'">\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <h5 class="card-title noPadding">' + name + '</h5>\n' +
                        '        <p class="card-text">' + value['message']['body'] + '</p>\n' +
                        '        <p class="card-text smallText"> <i>ID: ' + dialogID + '</i></p>\n' +
                        '    </div>\n' +
                        '</div>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            $(".showDialog").click(function() {
                getMessages($(this).attr('vcat-dialog'), $(this).attr('vcat-username'));
            });
            logInfo("DialogList", "Finish DialogList");
        }
    });
}

function getMessageDialogTitle(source_id,json) {
    var result;
    $.each(json['p'],function(index, value){
        if (value['id'] === source_id) {
            result = value['first_name']+" "+value['last_name'];
            return false;
        }
    });
    return result;
}

function getMessages(dialogID, uname) {
  logInfo("Dialog", "Get Dialog");
    var url = "https://api.vk.com/method/messages.getHistory?lang=ru&peer_id="+dialogID+"&access_token="+token+"&v=5.74";
    url = craftURL(url);
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    $.ajax({
        url: url,
        success: function( response ) {
          logInfo("Dialog", "Got Dialog JSON");
            var result = JSON.parse(response);
            console.log(response);
            $.each(result['response']['items'],function(index, value){
                var isSentByUser = value['out'];
                var time = timestampToTime(value['date']);
                var text = value['body'];
                var isSeen = value['read_state'];
                var userId = value['from_id'];
                var userName = uname;
                var cardAttachments = '<p class="card-text">';
                $.each(value['attachments'], function (index, value) {
                    var type = value['type'];
                    switch (type) {
                        case 'link':
                            cardAttachments += '<p><a href="' + value['link']['url'] + '">' + value['link']['url'] + '</a></p>';
                            break;
                        case 'photo':
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + value['photo']['photo_604'] + '"></p>';
                            cardAttachments += '<p><a href="' + value['photo']['photo_604'] + '">Открыть!</a></p>';
                            break;
                        case 'doc':
                            if (value['doc']['ext'] === "gif") {
                                cardAttachments += '<p><img class="dialogAttachPic" src="' + value['doc']['url'] + '"></p>';
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
                });
                cardAttachments += '</p>';
                if (isSentByUser == 1) {
                  userName = "Я";
                  $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageOut messageBorder">\n' +
                      '    <div class="card-body messagePadding">\n' +
                      '        <h5 class="card-title noPadding">' + userName + '</h5>\n' +
                      '        <p class="card-text">' + text + '</p>\n' +
                      cardAttachments +
                      '        <p class="card-text smallText"> <i>(' + time + '), Прочитано: '+ isSeen +'</i></p>\n' +
                      '    </div>\n' +
                      '</div>');
                } else {
                  $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder">\n' +
                      '    <div class="card-body messagePadding">\n' +
                      '        <h5 class="card-title noPadding">' + userName + '</h5>\n' +
                      '        <p class="card-text">' + text + '</p>\n' +
                      cardAttachments +
                      '        <p class="card-text smallText"> <i>(' + time + '), Прочитано: '+ isSeen +'</i></p>\n' +
                      '    </div>\n' +
                      '</div>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            logInfo("Dialog", "Finish Dialog");
        }
    });
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp*1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}
