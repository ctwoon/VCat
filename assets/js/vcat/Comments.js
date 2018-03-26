function getComments(postID, ownerID) {
    removeScrollFocus();
    removeDiscoverScrollFocus();
    logInfo("Comments", "Get Comments");
    var url = "https://api.vk.com/method/wall.getComments?owner_id="+ownerID+"&post_id="+postID+"&access_token="+token+"&extended=1&count=100&v=5.73";
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
          logInfo("Comments", "Got Comments JSON");
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                var userID = value['from_id'];
                var text = value['text'];
                var date = timestampToTime(value['date']);
                var userName = getCommentsUserName(Math.abs(userID), result['response']);
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder showComment">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h4 class="card-title smallTitle noPadding">' + userName + '</h4>\n' +
                    '        <p class="card-text">' + text + '</p>\n' +
                    '        <p class="card-text smallText">' + date + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
            logInfo("Comments", "Finish Comments");
        }
    });
}

function getCommentsUserName(source_id,json) {
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