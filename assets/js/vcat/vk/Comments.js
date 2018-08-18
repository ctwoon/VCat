function getComments(postID, ownerID) {
    location.hash = "postComments_"+postID+'_'+ownerID;
    removeScrollFocus();
    removeDiscoverScrollFocus();
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    sendData("wall", "getComments", "owner_id="+ownerID+"&post_id="+postID+"&extended=1&count=100", "5.73", function (result) {
        $.each(result['response']['items'],function(index, value){
            var userID = value['from_id'];
            var text = value['text'];
            var date = timestampToTime(value['date']);
            text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
            text = text.replace(/\[(\w+)\|([^[]+)\]/g, '<a class="bbcodelink" href="#link_$1">$2</a>');
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