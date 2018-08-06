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
                console.log(value['message']);
                var msgBody;
                if (value['message'].hasOwnProperty('attachments')) {
                   msgBody = "Вложение";
                } else {
                   msgBody = value['message']['body'];
                }
                if (value['message']['title'].length > 0) {
                    var isGroup = "(Беседа)";
                    var isGroup2 = true;
                    name = value['message']['title'] + " " + isGroup;
                    dialogID = parseInt(value['message']['chat_id']) + 2000000000;
                    $('.cardContainer').append('<a class="vcat-deeplink" href="#msg_chat_'+dialogID+'_0_'+isGroup2+'"><div class="card cardDecor semi-transparent showDialog message messageBorder" vcat-isGroup="'+isGroup2+'" vcat-dialog="'+dialogID+'">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                    '        <p class="card-text">' + msgBody + '</p>\n' +
                    '    </div>\n' +
                    '</div></a>');
                } else {
                    name = getMessageDialogTitle(dialogID, result['response']);
                    if (value['message']['out'] == 1) {
                      msgBody = "Вы: " + msgBody;
                    } else {
                      msgBody = name + ": " + msgBody;
                    }
                    $('.cardContainer').append('<a class="vcat-deeplink" href="#msg_im_'+dialogID+'_1_"><div class="card cardDecor semi-transparent showDialog message messageBorder" vcat-username="' + name + '" vcat-dialog="' + dialogID + '">\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
                        '        <p class="card-text">' + msgBody + '</p>\n' +
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
                if (isGroup) {
                    userName = getGroupUsername(userId, groupUsers);
                }
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
                var hasBackground = "";
                var backgroundStyle = "";
                var photoStyle = "";
                text = text.replace(/\[(\w+)\|([^[]+)\]/g, '<a class="bbcodelink" href="#link_$1">$2</a>');
                var cardAttachments = parseAttachments(value['attachments']);
                if (isSentByUser == 1) {
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageOut messageBorder">\n' +
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
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder">\n' +
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
    url = craftURL(url);
    $(".writeBoxText").val("");
    $.ajax({
        url: url,
        async:true,
        success: function (response) {
            var result = safeParse(response);
            if (Array.isArray(response['error'])) {
            } else {
            }
        }
    });
}

function editMessage(messageID, dialogID) {
    var message = prompt("Сообщение, на которое нужно изменить:");
    var url = "https://api.vk.com/method/messages.edit?message="+ encodeURIComponent(message) +"&peer_id=" + dialogID + "&message_id="+messageID+"&access_token=" + token + "&v=5.74";
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
        url = craftURL(url);
        $.ajax({
            url: url,
            async: false,
            success: function (response) {
            }
        });
    }
}
