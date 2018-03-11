/** VCat Main **/
var token = getItem("authToken");
var debug = false;
function getNews() {
    var url = "https://api.vk.com/method/newsfeed.get?access_token="+token+"&filters=post&v=5.73";
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
                if (value['text'].length !== 0) {
                    var cardAttachments = '<p class="card-text">';
                    $.each(value['attachments'], function( index, value ){
                        var type = value['type'];
                        cardAttachments += '<p>Attachment Type: '+type+'</p>';
                        switch (type) {
                            case 'link':
                                cardAttachments += '<p><a href="'+value['link']['url']+'">'+value['link']['url']+'</a></p>';
                                break;
                            case 'photo':
                                cardAttachments += '<p><img src="'+value['photo']['photo_604']+'"></p>';
                                break;
                        }
                        //cardAttachments += '<p>===</p>';
                    });
                    cardAttachments += '</p>';
                    var b;
                    if (value.hasOwnProperty('source_id')) {
                        b = getGroupID(Math.abs(value['source_id']));
                    } else {
                        b = '0';
                    }
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent">\n' +
                        '    <div class="card-body">\n' +
                        '        <h5 class="card-title">' + b + '</h5>\n' +
                        '        <p class="card-text">' + value['text'] + '</p>\n' +
                        '        <p class="card-text"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + '</p>\n' +
                        cardAttachments +
                        '    </div>\n' +
                        '</div>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide()
        }
    });
}

function getGroupID(source_id) {
    var url = "https://api.vk.com/method/groups.getById?access_token="+token+"&group_id="+source_id+"&v=5.73";
    var result;
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url,
        async: false,
        success: function( response ) {
            result = JSON.parse(response);
        }
    });
    return result['response'][0]['name'];
}