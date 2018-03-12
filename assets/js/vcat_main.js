/** VCat Main **/
var token = getItem("authToken");
if (!token) {
    window.location.href="index.html";
}
var ab = false;

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
