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
            var result = safeParse(response);
            logInfo("Discover", "Got Discover JSON");
            $.each(result['response']['items'],function(index, value){
                if (value['template'] == "title") {

                } else {
                    value = value['post'];
                        try {
                            if (value['text'].length !== 0) {
                                parseNewsfeed(value, result);
                            }
                        } catch (e) {
                            console.error(e);
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
            $(".commentCount").click(function() {
                var id = $(this).attr('vcat-postid');
                var source = $(this).attr('vcat-author');
                getComments(id, source);
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
            var result = safeParse(response);
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
            var result = safeParse(response);
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
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 150) {
        removeDiscoverScrollFocus();
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
