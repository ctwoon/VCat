function getMessageDialogs() {
    logInfo("DialogList", "Get DialogList");
    var url = "https://api.vk.com/method/execute.getDialogsWithProfilesNewFixGroups?lang=ru&https=1&count=40&access_token=" + token + "&v=5.69";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function (response) {
            //$('.cardContainer').append(response);
            var result = safeParse(response);
            logInfo("DialogList", "Got DialogList JSON");
            $.each(result['response']['a']['items'], function (index, value) {
                var dialogID = value['message']['user_id'];
                var name;
                if (value['message']['title'].length > 0) {
                    var isGroup = "(Беседа)";
                    var isGroup2 = true;
                    name = value['message']['title'] + " " + isGroup;
                    dialogID = parseInt(value['message']['chat_id']) + 2000000000;
                    $('.cardContainer').append('<a class="vcat-deeplink" href="#msg_chat_'+dialogID+'_0_'+isGroup2+'"><div class="card cardDecor semi-transparent showDialog message messageBorder" vcat-isGroup="'+isGroup2+'" vcat-dialog="'+dialogID+'">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                    '        <p class="card-text">' + value['message']['body'] + '</p>\n' +
                    '    </div>\n' +
                    '</div></a>');
                } else {
                    name = getMessageDialogTitle(dialogID, result['response']);
                    $('.cardContainer').append('<a class="vcat-deeplink" href="#msg_im_'+dialogID+'_1_'+name+'"><div class="card cardDecor semi-transparent showDialog message messageBorder" vcat-username="' + name + '" vcat-dialog="' + dialogID + '">\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                        '        <p class="card-text">' + value['message']['body'] + '</p>\n' +
                        '    </div>\n' +
                        '</div></a>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            $(".showDialog").click(function () {
                //getMessages($(this).attr('vcat-dialog'), $(this).attr('vcat-username'), $(this).attr('vcat-isGroup'));
            });
            logInfo("DialogList", "Finish DialogList");
        }
    });
}

function getGroupUsername2(userID, json) {
    var result;
    json = JSON.parse(json);
    $.each(json['response'],function(index, value){
        if (value['id'] == userID) {
            result = value['first_name'] + " " + value['last_name'];
            return false;
        }
    });
    return result;
}

function getMessageDialogTitle(source_id, json) {
    var result;
    $.each(json['p'], function (index, value) {
        if (value['id'] === source_id) {
            result = value['first_name'] + " " + value['last_name'];
            return false;
        }
    });
    return result;
}

function getMessages(dialogID, uname, isGroup) {
    logInfo("Dialog", "Get Dialog");
    var url = "https://api.vk.com/method/messages.getHistory?lang=ru&peer_id=" + dialogID + "&access_token=" + token + "&v=5.84";
    url = craftURL(url);
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    $.ajax({
        url: url,
        success: function (response) {
            logInfo("Dialog", "Got Dialog JSON");
            var result = safeParse(response);
            currentChatID = dialogID;
            result['response']['items'].reverse();
            if (isGroup) {
                groupUsers = getGroupUsers(dialogID);
            }
            $.each(result['response']['items'], function (index, value) {
                var isSentByUser = value['out'];
                var time = timestampToTime(value['date']);
                var text = value['text'];
                text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                var userId = value['from_id'];
                var userName = uname;
                var messageID = value['id'];
                var backgroundStyle = "";
                var photoStyle = "";
                var hasBackground = "";
                if (isGroup) {
                    userName = getGroupUsername(userId, groupUsers);
                }
                var cardAttachments = '<p class="card-text">';
                $.each(value['attachments'], function (index, value) {
                    var type = value['type'];
                    switch (type) {
                        case 'link':
                            cardAttachments += '<p><a href="' + value['link']['url'] + '">' + value['link']['url'] + '</a></p>';
                            break;
                        case 'photo':
                            var photoURLs = value['photo']['sizes'];
                            var photoURL = photoURLs[photoURLs.length-1];
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + photoURL['url'] + '"></p>';
                            cardAttachments += '<p><a href="' + photoURL['url'] + '">Открыть фотографию!</a></p>';
                            break;
                        case 'doc':
                            if (value['doc']['ext'] === "gif") {
                                cardAttachments += '<p><img class="dialogAttachPic" src="' + value['doc']['url'] + '"></p>';
                            }
                            var size = value['doc']['size'] / 1000 / 1000;
                            size = size.toFixed(2);
                            cardAttachments += '<p><a href="' + value['doc']['url'] + '">' + value['doc']['title'] + ' (размер: ' + size + 'MB)</a></p>';
                            break;
                        case 'poll':
                            console.log(value['poll']);
                            if (value['poll'].hasOwnProperty('background')) {
                                hasBackground = "btn-bg";
                                var bg = value['poll']['background'];
                                if (bg['type'] === "gradient") {
                                    backgroundStyle = "style='color: white; background: linear-gradient("+bg['angle']+"deg, #"+bg['points'][0]['color']+", #"+bg['points'][1]['color']+")'";
                                    console.log("Found a Poll Background => Angle: "+bg['angle']+", Color 1: #"+bg['points'][0]['color']+", Color 2: #"+bg['points'][1]['color']);
                                }
                            }
                            if (value['poll'].hasOwnProperty('photo')) {
                                hasBackground = "btn-bg";
                                var ph = value['poll']['photo'];
                                console.log(ph['images'][0]['url']);
                                photoStyle = "style=\"background-image: url('";
                                photoStyle += ph['images'][0]['url'];
                                photoStyle += "'); background-size: cover; background-repeat: no-repeat;color: white; background-color: #121212;\"";
                                console.log("Found a Image Background");
                            }
                            cardAttachments += '<p>Голосование: ' + value['poll']['question'] + ' (' + value['poll']['votes'] + ' голосов)</p>';
                            $.each(value['poll']['answers'], function (index, value) {
                                cardAttachments += '<p>- ' + value['text'] + ' (' + value['votes'] + ' голосов) [' + value['rate'] + '%]</p>';
                            });
                            break;
                        case 'audio':
                            var durMin = Math.floor(value['audio']['duration'] / 60);
                            var durSec = value['audio']['duration'] - durMin * 60;
                            cardAttachments += '<p>Аудиозапись: ' + value['audio']['title'] + ' от ' + value['audio']['artist'] + ' [' + durMin + ':' + durSec + ']</p>';
                            break;
                        case 'video':
                            var durMin = Math.floor(value['video']['duration'] / 60);
                            var durSec = value['video']['duration'] - durMin * 60;
                            cardAttachments += '<p>Видеозапись: ' + value['video']['title'] + ' (ID: ' + value['video']['id'] + ') [' + durMin + ':' + durSec + ']</p>';
                            break;
                        case 'graffiti':
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + value['graffiti']['url'] + '"></p>';
                            cardAttachments += '<p><a href="' + value['graffiti']['url'] + '">Открыть графитти!</a></p>';
                            break;
                        case 'sticker':
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + value['sticker']['images'][0]['url'] + '"></p>';
                            if (debugInfo) {
                                cardAttachments += '<p>Информация о стикере: Коллекция - ' + value['sticker']['product_id'] + ', Код стикера - ' + value['sticker']['sticker_id'] + '</p>';
                            }
                            cardAttachments += '<p>Скачать - <a href="' + value['sticker']['images'][1]['url'] + '">64px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][1]['url'] + '">128px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][2]['url'] + '">256px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][3]['url'] + '">352px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][4]['url'] + '">512px</a></p>';
                            break;
                        default:
                            cardAttachments += '<p>Неподдерживаемый тип вложения: ' + type + '. Информация выведена в DevTools.</p>';
                            console.log(value);
                            break;
                    }
                });
                if (typeof value['action'] !== "undefined") {
                    var rs;
                    switch (value['action']['type']) {
                        case 'chat_unpin_message':
                            rs = "открепил сообщение";
                            break;
                        case 'chat_pin_message':
                            rs = "закрепил сообщение";
                            break;
                        case 'chat_invite_user':
                            rs = "пригласил "+getGroupUsername(value['action']['member_id'], groupUsers);
                            break;
                        default:
                            rs = "выполнил неизвестное действие "+value['action']['type'];
                            break;
                    }
                    text = userName+" "+rs+".";
                    userName = "";
                }
                cardAttachments += '</p>';
                if (isSentByUser == 1) {
                    userName = "Я";
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageOut messageBorder" '+backgroundStyle+' '+photoStyle+' >\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <p class="card-text">' + text + '</p>\n' +
                        cardAttachments +
                        '        <p class="card-text smallText"><i>' + time + '</i></p>\n' +
                        '    <div class="btn-zone">\n' +
                        '    <button type="button" class="'+hasBackground+' btn editMessage" vcat-msgid="'+messageID+'" vcat-dialogid="'+dialogID+'"><i data-feather="edit-3"></i></button>\n' +
                        '    <button type="button" class="'+hasBackground+' btn removeMessage" vcat-msgid="'+messageID+'" vcat-dialogid="'+dialogID+'"><i data-feather="x-circle"></i></button>\n' +
                        '    </div>\n' +
                        '    </div>\n' +
                        '</div>');
                } else {
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder" '+backgroundStyle+' '+photoStyle+' >\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <h5 class="card-title noPadding smallTitle">' + userName + '</h5>\n' +
                        '        <p class="card-text">' + text + '</p>\n' +
                        cardAttachments +
                        '        <p class="card-text smallText"> <i>' + time + '</i></p>\n' +
                        '    </div>\n' +
                        '</div>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            logInfo("Dialog", "Finish Dialog");
            setTimeout(function () {
                jumpToEnd();
            }, 500);
            isInMessages = true;
            poll();
            $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder writeBoxWrap">\n' +
                '    <div class="card-body messagePadding">\n' +
                '<div class="input-group">' +
                '<input type="text" class="form-control writeBoxText" placeholder="Сообщение">' +
                '<input type="hidden" class="vcatSend" vcat-sendto="'+dialogID+'">' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-default writeBoxButton" type="button">Отправить!</button>' +
                '</span>' +
                '</div>' +
                '    </div>\n' +
                '</div>');
            $(".writeBoxButton").click(function () {
                sendMessage($(".vcatSend").attr('vcat-sendto'), $(".writeBoxText").val());
            });
            $(".editMessage").click(function () {
                editMessage($(this).attr('vcat-msgid'), $(this).attr('vcat-dialogid'));
                getMessages(dialogID, uname, isGroup);
            });
            $(".removeMessage").click(function () {
                removeMessage($(this).attr('vcat-msgid'), $(this).attr('vcat-dialogid'));
                getMessages(dialogID, uname, isGroup);
            });
        }
    });
}

function getGroupUsers(chatID) {
    chatID = parseInt(chatID) - 2000000000;
    var url = "https://api.vk.com/method/messages.getChatUsers?lang=ru&fields=first_name,last_name&chat_id=" + chatID + "&access_token=" + token + "&v=5.74";
    logInfo("ChatUsers", "Get ChatUsers");
    url = craftURL(url);
    var result1;
    $.ajax({
        url: url,
        async:false,
        success: function (response) {
            result1 = response;
        }
    });
    return result1;
}

function getGroupUsername(userID, json) {
    var result;
    json = JSON.parse(json);
    $.each(json['response'],function(index, value){
        if (value['id'] === userID) {
            result = value['first_name'] + " " + value['last_name'];
            return false;
        }
    });
    return result;
}

function sendMessage(dialogID, message) {
    var url = "https://api.vk.com/method/messages.send?message="+ encodeURIComponent(message) +"&peer_id=" + dialogID + "&access_token=" + token + "&v=5.74";
    logInfo("SendMessages", "Get SendMessages");
    url = craftURL(url);
    $(".writeBoxText").val("");
    $.ajax({
        url: url,
        async:true,
        success: function (response) {
            var result = safeParse(response);
            if (Array.isArray(response['error'])) {
                logInfo("SendMessages", "Error: "+result['error']['error_msg']);
            } else {
                logInfo("SendMessages", "Done");
            }
        }
    });
}

function editMessage(messageID, dialogID) {
    var message = prompt("Сообщение, на которое нужно изменить:");
    var url = "https://api.vk.com/method/messages.edit?message="+ encodeURIComponent(message) +"&peer_id=" + dialogID + "&message_id="+messageID+"&access_token=" + token + "&v=5.74";
    logInfo("EditMessage", "Get EditMessage");
    url = craftURL(url);
    $.ajax({
        url: url,
        async:false,
        success: function (response) {
        }
    });
}

function removeMessage(messageID, dialogID) {
    var allow = confirm("Удалить сообщение?");
    if (allow == true) {
        var deleteForAll = "&delete_for_all=true";
        var url = "https://api.vk.com/method/messages.delete?message_ids=" + messageID + deleteForAll + "&access_token=" + token + "&v=5.74";
        logInfo("RemoveMessage", "Get RemoveMessage");
        url = craftURL(url);
        $.ajax({
            url: url,
            async: false,
            success: function (response) {
            }
        });
    }
}
