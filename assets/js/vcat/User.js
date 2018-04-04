function getUser(userID) {
  logInfo("User", "Get User");
  var fields = "sex,bdate,city,country,domain,online";
    var url = "https://api.vk.com/method/users.get?fields="+fields+"&user_ids="+userID+"&access_token="+token+"&v=5.73";
    url = craftURL(url);
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    $.ajax({
        url: url,
        success: function( response ) {
          logInfo("User", "Got User JSON");
            var result = JSON.parse(response);
            var name;
            $.each(result['response'],function(index, value){
                var onlineState;
                if (value['online'] == 1) {
                    onlineState = "онлайн";
                } else {
                    onlineState = "оффлайн"
                }
                var sex;
                if (value['sex'] == 1) {
                    sex = "Женщина";
                } else {
                    sex = "Мужчина";
                }
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder userMainCard">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h4 class="card-title noPadding">' + value['first_name'] + ' ' + value['last_name'] + '</h4>\n' +
                    '        <p class="card-text">@' + value['domain'] + ', '+onlineState+'</p>\n' +
                    '    </div>\n' +
                    '</div>');
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder userMainCard">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h4 class="card-title noPadding smallTitle">Информация</h4>\n' +
                    '        <p class="card-text">День рождения: ' + value['bdate'] + '</p>\n' +
                    '        <p class="card-text">Пол: ' + sex + '</p>\n' +
                    '        <p class="card-text">Место проживания: ' + value['city']['title'] + ', ' + value['country']['title'] + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
                name = value['first_name']+" "+value['last_name'];
            });
            feather.replace();
            $('.spinnerLoad').hide();
            getUserWall(userID, name);
            logInfo("User", "Finish User");
        }
    });
}

function getCurrentUser() {
    getUser(user_id);
}

function getUserWall(userID, uname) {
    logInfo("UserWall", "Get UserWall");
    var url = "https://api.vk.com/method/wall.get?extended=1&owner_id="+userID+"&access_token="+token+"&v=5.73";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            logInfo("UserWall", "Got UserWall JSON");
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                    if (value['marked_as_ads'] == 0) {
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
                                    size = size.toFixed(2);
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
                        var b = uname;
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
                        var date = timestampToTime(value['date']);
                        var isLikedClass="";
                        var isLiked="false";
                        if (value['likes']['user_likes'] == 1) {
                            isLikedClass="text-danger";
                            isLiked=true;
                        }
                        var itemID = value['id'];
                        $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder">\n' +
                            '    <div class="card-body messagePadding">\n' +
                            '        <h5 class="card-title noPadding smallTitle">' + b + '</h5>\n' +
                            '        <p class="card-text">' + text + '</p>\n' +
                            cardAttachments +
                            '        <p class="card-text smallText"> <i>' + date + '</i></p>\n' +
                            '        <p class="card-text"><abbr class="likeCount '+isLikedClass+'" vcat-author="'+value['owner_id']+'" vcat-postid="'+itemID+'" vcat-isliked="'+isLiked+'"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + '</abbr>&nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + views + '\n' +
                            '    </div>\n' +
                            comment +
                            '</div>');
                    } else if (!value['marked_as_ads']) {
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
                                    size = size.toFixed(2);
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
                        var b = uname;
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
                        var date = timestampToTime(value['date']);
                        var isLikedClass="";
                        var isLiked="false";
                        if (value['likes']['user_likes'] == 1) {
                            isLikedClass="text-danger";
                            isLiked=true;
                        }
                        var itemID = value['id'];
                        $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder">\n' +
                            '    <div class="card-body messagePadding">\n' +
                            '        <h5 class="card-title noPadding smallTitle">' + b + '</h5>\n' +
                            '        <p class="card-text">' + text + '</p>\n' +
                            cardAttachments +
                            '        <p class="card-text smallText"> <i>' + date + '</i></p>\n' +
                            '        <p class="card-text"><abbr class="likeCount '+isLikedClass+'" vcat-author="'+value['owner_id']+'" vcat-postid="'+itemID+'" vcat-isliked="'+isLiked+'"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + '</abbr>&nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + views + '\n' +
                            '    </div>\n' +
                            comment +
                            '</div>');
                    }
            });
            feather.replace();
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
            logInfo("UserWall", "Finish UserWall");
        }
    });
}