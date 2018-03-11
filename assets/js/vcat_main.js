/** VCat Main **/
var token = getItem("authToken");
var debug = true;
function getNews() {
    var url = "https://api.vk.com/method/execute.getNewsfeedSmart?access_token="+token+"&filters=post&v=5.68&app_package_id=com.vkontakte.android";
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url,
        success: function( response ) {
            console.log(response);
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                if (value['text'].length !== 0) {
                    var cardAttachments = '<p class="card-text">';
                    $.each(value['attachments'], function( index, value ){
                        var type = value['type'];
                        //cardAttachments += '<p>Attachment Type: '+type+'</p>';
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
                    var b = getGroupID(Math.abs(value['source_id']),result['response']['groups']);
                    //var b = '0';
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent">\n' +
                        '    <div class="card-body">\n' +
                        '        <h5 class="card-title">' + b + '</h5>\n' +
                        '        <p class="card-text">' + value['text'] + '</p>\n' +
                        cardAttachments +
                        '        <p class="card-text"><i data-feather="thumbs-up"></i> ' + value['likes']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="send"></i> ' + value['reposts']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="message-square"></i> ' + value['comments']['count'] + ' &nbsp;&nbsp;&nbsp;<i data-feather="eye"></i> ' + value['views']['count'] + '</p>\n' +
                        '    </div>\n' +
                        '</div>');
                }
            });
            feather.replace();
            $('.spinnerLoad').hide()
        }
    });
}

function getGroupID(source_id,json) {
    var result;
    $.each(json,function(index, value){
        if (value['id'] === source_id) {
            result = value['name'];
            return false;
        }
    });
    return result;
}