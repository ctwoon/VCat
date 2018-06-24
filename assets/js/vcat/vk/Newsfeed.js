function showLoadError(code, desc, rcn) {
  $('.spinnerLoad').append('<p>Ошибка '+code+' / '+desc+'<br>'+rcn+'</p>');
  $('.spinner').hide();
}

var ab = false;
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
            var result = safeParse(response);
            logInfo("Newsfeed", "Got Newsfeed JSON");
            $.each(result['response']['items'],function(index, value){
                if (value['marked_as_ads'] === 0) {
                    if (value['text'].length !== 0) {
                        parseNewsfeed(value, result);
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
                    $(this).attr('vcat-isliked', false);
                    $(this).attr('class', 'likeCount');
                    $(this).contents().filter(function() {
                        return this.nodeType == 3
                    }).each(function(){
                        this.textContent = this.textContent.replace($(this).text().toString(), $(this).text()-1);
                    });
                    unlikePost(id, source);
                }
            });
            $(".commentCount").click(function() {
                var id = $(this).attr('vcat-postid');
                var source = $(this).attr('vcat-author');
                getComments(id, source);
            });
            logInfo("Newsfeed", "Finish Newsfeed");
            sendOffline();
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

function parseNewsfeed(value, result) {
    var cardAttachments = '<p class="card-text">';
    var emptyAttachments = true;
    $.each(value['attachments'], function (index, value) {
        var type = value['type'];
        emptyAttachments = false;
        //cardAttachments += '<p>Attachment Type: '+type+'</p>';
        switch (type) {
            case 'link':
                cardAttachments += '<p><a href="' + value['link']['url'] + '">' + value['link']['url'] + '</a></p>';
                break;
            case 'photo':
                cardAttachments += '<p><img src="' + value['photo']['photo_130'] + '"></p>';
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
    var b = getGroupID(Math.abs(value['source_id']), result['response']);
    var text = value['text'].replace(/(?:\r\n|\r|\n)/g, '<br>');
    if (emptyAttachments) {
        if (enlargeText == "enabled") {
            text = "<span class='vk5-largeText'>" + text + "</span>";
        }
    }
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
    if (typeof b === "undefined") {
        b = "";
    }
    var itemID = value['post_id'];
    $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">' + b + '</h5>\n' +
        '        <p class="card-text">' + text + '</p>\n' +
        cardAttachments +
        '        <p class="card-text postCounters"><span class="likeCount pointer '+isLikedClass+'" vcat-author="'+value['source_id']+'" vcat-postid="'+itemID+'" vcat-isliked="'+isLiked+'"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + '</span>&nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<span class="commentCount" vcat-author="'+value['source_id']+'" vcat-postid="'+itemID+'"><i data-feather="message-square"></i> ' + value['comments']['count'] + '</span>&nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + views + '&nbsp;&nbsp;&nbsp;<i data-feather="clock"></i> '+date+'\n' +
        '    </div>\n' +
        comment +
        '</div>');
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

function sendOffline() {
    if (offlineMode == "enabled") {
        logInfo("Offline", "Send Offline State");
        var url = "https://api.vk.com/method/account.setOffline?access_token=" + token + "&v=5.73";
        url = craftURL(url);
        $.ajax({
            url: url,
            success: function (response) {
                var result = JSON.parse(response);
                logInfo("Offline", "Offline send OK - " + response);
            }
        });
    }
}

function newsScrollHandler() {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 150) {
        removeScrollFocus();
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

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2);
}
