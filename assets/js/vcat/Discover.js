/** Nice try, VK! :D */
var ab2 = false;
function getDiscover(attr) {
    logInfo("Discover", "Get Discover");
    var url;
    if (typeof attr === "undefined") {
        url = "https://api.vk.com/method/newsfeed.getDiscover?extended=1&access_token="+token+"&v=5.74&app_package_id=com.vkontakte.android";
    } else {
        url = "https://api.vk.com/method/newsfeed.getDiscover?extended=1&access_token="+token+"&v=5.74&app_package_id=com.vkontakte.android&start_from="+attr;
    }
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            logInfo("Discover", "Got Discover JSON");
            logError(response);
            $.each(result['response']['items'],function(index, value){
                if (value['template'] == "title") {

                } else {
                    value = value['post'];
                    if (value['marked_as_ads'] === 0) {
                        if (value['text'].length !== 0) {
                            console.log("GOT HERE");
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
                                        cardAttachments += '<p><a href="' + value['doc']['url'] + '">' + value['doc']['title'] + ' (размер: ' + size + 'MB)</a></p>';
                                        break;
                                    case 'poll':
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
                                    default:
                                        cardAttachments += '<p>Неподдерживаемый тип вложения: ' + type + '</p>';
                                        break;
                                }
                                //cardAttachments += '<p>===</p>';
                            });
                            cardAttachments += '</p>';
                            var b = getDiscoverGroupID(Math.abs(value['source_id']), result['response']);
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
                            var isLikedClass = "";
                            var isLiked = "false";
                            if (value['likes']['user_likes'] == 1) {
                                isLikedClass = "text-danger";
                                isLiked = true;
                            }
                            var itemID = value['post_id'];
                            $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder">\n' +
                                '    <div class="card-body messagePadding">\n' +
                                '        <h5 class="card-title noPadding smallTitle">' + b + '</h5>\n' +
                                '        <p class="card-text">' + text + '</p>\n' +
                                cardAttachments +
                                '        <p class="card-text smallText"> <i>' + date + '</i></p>\n' +
                                '        <p class="card-text"><ab2br class="likeCount ' + isLikedClass + '" vcat-author="' + value['source_id'] + '" vcat-postid="' + itemID + '" vcat-isliked="' + isLiked + '"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + '</ab2br>&nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + views + '\n' +
                                '    </div>\n' +
                                comment +
                                '</div>');
                        }
                    }
                }
            });
            feather.replace();
            $('.spinnerLoad').hide();
            var nextID = result['response']['next_from'];
            $('.cardContainer').attr('vcat-next', nextID);
            initOnScrollDiscover();
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
            logInfo("Discover", "Finish Discover");
        }
    });
}

function likePost(id, source) {
    logInfo("Discover", "Like Post #"+id);
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
    logInfo("Discover", "Unlike Post #"+id);
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


function initOnScrollDiscover() {
    if (ab2 === false) {
        $(window).scroll(discoverScrollHandler);
        ab2 = true;
    }
}

function discoverScrollHandler() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        getDiscover($('.cardContainer').attr('vcat-next'));
    }
}

function getDiscoverGroupID(source_id,json) {
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
