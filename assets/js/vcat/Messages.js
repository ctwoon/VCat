function getMessageDialogs() {
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
                        '        <h5 class="card-title noPadding smallTitle">' + name + '</h5>\n' +
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
            result['response']['items'].reverse();
            $.each(result['response']['items'],function(index, value){
                var isSentByUser = value['out'];
                var time = timestampToTime(value['date']);
                var text = value['body'];
                text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
                      '        <p class="card-text">' + text + '</p>\n' +
                      cardAttachments +
                      '        <p class="card-text smallText"> <i>(' + time + '), Прочитано: '+ isSeen +'</i></p>\n' +
                      '    </div>\n' +
                      '</div>');
                } else {
                  $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder">\n' +
                      '    <div class="card-body messagePadding">\n' +
                      '        <h5 class="card-title noPadding smallTitle">' + userName + '</h5>\n' +
                      '        <p class="card-text">' + text + '</p>\n' +
                      cardAttachments +
                      '        <p class="card-text smallText"> <i>(' + time + '), Прочитано: '+ isSeen +'</i></p>\n' +
                      '    </div>\n' +
                      '</div>');
                }
            });
            $('.cardContainer').append('<a id="endOfDialog"></a>');
            feather.replace();
            $('.spinnerLoad').hide();
            logInfo("Dialog", "Finish Dialog");
            setTimeout(function(){ jump("endOfDialog"); }, 500);
            $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder">\n' +
                '    <div class="card-body messagePadding">\n' +
                '<div class="input-group">' +
                '<input type="text" class="form-control writeBoxText bg-dark" placeholder="Сообщение">' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-default btn-dark writeBoxButton" type="button">Отправить!</button>' +
                '</span>' +
                '</div>' +
                '    </div>\n' +
                '</div>');
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
