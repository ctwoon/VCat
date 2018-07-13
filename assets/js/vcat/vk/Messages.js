function getMessageDialogs() {
    var url = "https://api.vk.com/method/execute.getDialogsWithProfilesNewFixGroups?lang=ru&https=1&count=40&access_token=" + token + "&v=5.69";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function (response) {
            var result = safeParse(response);
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
                    $('.cardContainer').append('<a class="vcat-deeplink" href="#msg_im_'+dialogID+'_1_"><div class="card cardDecor semi-transparent showDialog message messageBorder" vcat-username="' + name + '" vcat-dialog="' + dialogID + '">\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                        '        <p class="card-text">' + value['message']['body'] + '</p>\n' +
                        '    </div>\n' +
                        '</div></a>');
                }
            });
            $('.spinnerLoad').hide();
        }
    });
}

function getGroupUsername2(userID) {
    var result;
    $.each(groupUsers,function(index, value){
        if (value['id'] == userID) {
            result = value['first_name'] + " " + value['last_name'];
            return false;
        }
    });
    return result;
}

function getGroupUsers(chatID) {
    chatID = parseInt(chatID) - 2000000000;
    var url = "https://api.vk.com/method/messages.getChatUsers?lang=ru&fields=first_name,last_name&chat_id=" + chatID + "&access_token=" + token + "&v=5.74";
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

var groupUsers2;

function getMessages(dialogID, isGroup) {
    logInfo("Dialog", "Get Dialog");
    var url = "https://api.vk.com/method/messages.getHistory?lang=ru&extended=1&peer_id=" + dialogID + "&access_token=" + token + "&v=5.84";
    url = craftURL(url);
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    $.ajax({
        url: url,
        success: function (response) {
            var result = safeParse(response);
            console.log(result);
            currentChatID = dialogID;
            result['response']['items'].reverse();
            groupUsers = result['response']['profiles'];
            groupUsers2 = result['response']['groups'];
            $.each(result['response']['items'], function (index, value) {
                var isSentByUser = value['out'];
                var time = timestampToTime(value['date']);
                var text = value['text'];
                text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                var userId = value['from_id'];
                var userName = getGroupUsername(Math.abs(userId));

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
                            if (liteMode == "disabled") {
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + photoURL['url'] + '"></p>';
                            }
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
                        case 'audio_message':
                            var durMin = Math.floor(value['audio_message']['duration'] / 60);
                            var durSec = value['audio_message']['duration'] - durMin * 60;
                            var durMin = new String(durMin).padStart(2,0);
                            var durSec = new String(durSec).padStart(2,0);
                            cardAttachments += '<p>Голосовая запись: <a href="'+value['audio_message']['link_mp3']+'">MP3</a>' + '&nbsp;/&nbsp;<a href="'+value['audio_message']['link_ogg']+'">OGG</a>&nbsp;'  + '[' + durMin + ':' + durSec + ']</p>';
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
                            var userAnswers = [];
                            if (value['poll'].hasOwnProperty('answer_ids')) {
                                userAnswers = value['poll']['answer_ids'];
                            }
                            if (value['poll'].hasOwnProperty('photo')) {
                                hasBackground = "btn-bg";
                                var ph = value['poll']['photo'];
                                photoStyle = "style=\"background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('";
                                photoStyle += ph['images'][0]['url'];
                                photoStyle += "'); background-size: cover; background-repeat: no-repeat;color: white; background-color: #121212;\"";
                                console.log("Found a Image Background");
                            }
                            cardAttachments += '<p>Голосование: ' + value['poll']['question'] + ' (' + value['poll']['votes'] + ' голосов)</p>';
                            $.each(value['poll']['answers'], function (index, value) {
                                var userPoint = "";
                                var userPoint2 = "";
                                if (userAnswers.includes(value['id'])) {
                                    userPoint = "poll-user";
                                    userPoint2 = " <i data-feather=\"check\"></i>";
                                }
                                cardAttachments += '<div class="progress"><div class="progress-bar '+userPoint+'" role="progressbar" style="width: '+value['rate']+'%;" aria-valuenow="'+value['rate']+'" aria-valuemin="0" aria-valuemax="100"></div>';
                                cardAttachments += '<span class="poll-answer-left">' + value['text'] +userPoint2+'</span><span class="poll-answer-right">[' + value['rate'] + '%]</span></div>';
                            });
                            break;
                        case 'audio':
                            var durMin = Math.floor(value['audio']['duration'] / 60);
                            var durSec = value['audio']['duration'] - durMin * 60;
                            var durMin = new String(durMin).padStart(2,0);
                            var durSec = new String(durSec).padStart(2,0);
                            cardAttachments += '<p>Аудиозапись: ' + value['audio']['title'] + ' от ' + value['audio']['artist'] + ' [' + durMin + ':' + durSec + ']</p>';
                            break;
                        case 'video':
                            var durMin = Math.floor(value['video']['duration'] / 60);
                            var durSec = value['video']['duration'] - durMin * 60;
                            cardAttachments += '<p>Видеозапись: ' + value['video']['title'] + ' (ID: ' + value['video']['id'] + ') [' + durMin + ':' + durSec + ']</p>';
                            break;
                        case 'graffiti':
                            if (liteMode == "disabled") {
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + value['graffiti']['url'] + '"></p>';
                            }
                            cardAttachments += '<p><a href="' + value['graffiti']['url'] + '">Открыть графитти!</a></p>';
                            break;
                        case 'sticker':
                            if (liteMode == "disabled") {
                            cardAttachments += '<p><img class="dialogAttachPic" src="' + value['sticker']['images'][0]['url'] + '"></p>';
                            }
                            cardAttachments += '<p>Стикер: <a href="' + value['sticker']['images'][1]['url'] + '">64px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][1]['url'] + '">128px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][2]['url'] + '">256px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][3]['url'] + '">352px</a>&nbsp;&nbsp;<a href="' + value['sticker']['images'][4]['url'] + '">512px</a></p>';
                            break;
                        case 'article':
                            hasBackground = "btn-bg";
                            var art = value['article'];
                            var size = art['photo']['sizes'];
                            photoStyle = "style=\"background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('";
                            photoStyle += size[size.length-1]['url'];
                            photoStyle += "'); background-size: cover; background-repeat: no-repeat;color: white; background-color: #121212;\"";
                            cardAttachments += '<p>'+art['owner_name']+'</p>';
                            cardAttachments += '<p>'+art['title']+'</p>';
                            cardAttachments += '<p>'+art['view_url']+'</p>';
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
                text = text.replace(/\[(\w+)\|([^[]+)\]/g, '<a class="bbcodelink" href="#link_$1">Ссылка: $2</a>')
                cardAttachments += '</p>';
                if (isSentByUser == 1) {
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageOut messageBorder" '+backgroundStyle+' '+photoStyle+' >\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <p class="card-text">' + text + '</p>\n' +
                        cardAttachments +
                        '    <div class="btn-zone">\n' +
                        '    <button type="button" class="'+hasBackground+' btn editMessage" vcat-msgid="'+messageID+'" vcat-dialogid="'+dialogID+'"><i data-feather="edit-3"></i></button>\n' +
                        '    <button type="button" class="'+hasBackground+' btn removeMessage" vcat-msgid="'+messageID+'" vcat-dialogid="'+dialogID+'"><i data-feather="x-circle"></i></button>\n' +
                        '    <button type="button" class="'+hasBackground+' btn timeButton" vcat-msgid="'+messageID+'" vcat-dialogid="'+dialogID+'">'+time+'</button>\n' +
                        '    </div>\n' +
                        '    </div>\n' +
                        '</div>');
                } else {
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder" '+backgroundStyle+' '+photoStyle+' >\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <h5 class="card-title noPadding smallTitle">' + userName + '</h5>\n' +
                        '        <p class="card-text">' + text + '</p>\n' +
                        cardAttachments +
                        '    <div class="btn-zone">\n' +
                        '    <button type="button" class="'+hasBackground+' btn timeButton" vcat-msgid="'+messageID+'" vcat-dialogid="'+dialogID+'">'+time+'</button>\n' +
                        '    </div>\n' +
                        '    </div>\n' +
                        '</div>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            setTimeout(function () {
                jumpToEnd();
            }, 500);
            isInMessages = true;
            poll();
            if (result['response']['conversations'][0].hasOwnProperty('chat_settings')) {
                if (!result['response']['conversations'][0]['chat_settings']['is_group_channel']) {
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder writeBoxWrap">\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '<div class="input-group">' +
                        '<input type="text" class="form-control writeBoxText" placeholder="Сообщение">' +
                        '<input type="hidden" class="vcatSend" vcat-sendto="' + dialogID + '">' +
                        '<span class="input-group-btn">' +
                        '<button class="btn btn-default writeBoxButton" type="button">Отправить!</button>' +
                        '</span>' +
                        '</div>' +
                        '    </div>\n' +
                        '</div>');
                }
            } else if (result['response']['conversations'][0].hasOwnProperty('current_keyboard')) {
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder writeBoxWrap">\n' +
                    '<div class="card-body messagePadding">\n' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control writeBoxText" placeholder="Сообщение">' +
                    '<input type="hidden" class="vcatSend" vcat-sendto="' + dialogID + '">' +
                    '<span class="input-group-btn">' +
                    '<button class="btn btn-default writeBoxButton" type="button">Отправить!</button>' +
                    '</span></div>');
                result['response']['conversations'][0]['current_keyboard']['buttons'].forEach(function (element) {
                    element.forEach(function (element) {
                        console.log("Button: Color "+element['color']+", Label: "+element['action']['label']);
                    })
                });    
                $('.cardContainer').append('</div></div>');
            } else {
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder writeBoxWrap">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '<div class="input-group">' +
                    '<input type="text" class="form-control writeBoxText" placeholder="Сообщение">' +
                    '<input type="hidden" class="vcatSend" vcat-sendto="' + dialogID + '">' +
                    '<span class="input-group-btn">' +
                    '<button class="btn btn-default writeBoxButton" type="button">Отправить!</button>' +
                    '</span>' +
                    '</div>' +
                    '    </div>\n' +
                    '</div>');
            }
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

function getGroupUsername(userID) {
    var result;
    $.each(groupUsers,function(index, value){
        if (value['id'] === userID) {
            result = value['first_name'] + " " + value['last_name'];
            return false;
        }
    });
    $.each(groupUsers2,function(index, value){
        if (value['id'] == userID) {
            result = value['name'];
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
