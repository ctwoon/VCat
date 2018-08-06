function getUser(userID) {
  var fields = "sex,bdate,city,country,domain,online";
    var url = "https://api.vk.com/method/users.get?fields="+fields+"&user_ids="+userID+"&access_token="+token+"&v=5.73";
    url = craftURL(url);
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    $.ajax({
        url: url,
        success: function( response ) {
            var result = safeParse(response);
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
                name = value['first_name']+" "+value['last_name'];
            });
            feather.replace();
            $('.spinnerLoad').hide();
            userID = userID.replace("id", "");
            getUserWall(userID, name);
        }
    });
}

function getCurrentUser() {
    getUser(user_id);
}

function getUserWall(userID, uname) {
    var url = "https://api.vk.com/method/wall.get?extended=1&owner_id="+userID+"&access_token="+token+"&v=5.83";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                    if (value['marked_as_ads'] == 0) {
                        parseNewsfeed(value, result);
                    } else if (!value['marked_as_ads']) {
                        parseNewsfeed(value, result);
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
            $(".commentCount").click(function() {
                var id = $(this).attr('vcat-postid');
                var source = $(this).attr('vcat-author');
                getComments(id, source);
            });
        }
    });
}