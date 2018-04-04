function getGroups() {
  logInfo("GroupList", "Get GroupList");
    var url = "https://api.vk.com/method/groups.get?user_id="+user_id+"&extended=1&access_token="+token+"&v=5.73&count=999";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            logInfo("GroupList", "Got GroupList JSON");
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder showGroup" vcat-groupid="'+value['id']+'">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <p class="card-text">' + value['name'] + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
            $(".showGroup").click(function () {
                getGroupInfo($(this).attr('vcat-groupid'));
            });
            logInfo("GroupList", "Finish GroupList");
        }
    });
}

function getGroupInfo(groupID) {
    logInfo("GroupInfo", "Get GroupInfo");
    var fields = "id,name,screen_name,description";
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    var url = "https://api.vk.com/method/groups.getById?group_ids="+groupID+"&fields="+fields+"&access_token="+token+"&v=5.73";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            logInfo("GroupInfo", "Got GroupInfo JSON");
            console.log(response);
            var result = JSON.parse(response);
            $.each(result['response'],function(index, value){
                var closedState;
                var groupType;
                if (value['type'] == "group") {
                    groupType = "группа";
                } else if (value['type'] == "page") {
                    groupType = "страница";
                } else {
                    groupType = "встреча";
                }
                if (value['is_closed'] == 0) {
                    closedState = "открытая "+groupType;
                } else if (value['is_closed'] == 1) {
                    closedState = "закрытая "+groupType;
                } else {
                    closedState = "частная "+groupType;
                }
                var description = value['description'].replace(/(?:\r\n|\r|\n)/g, '<br>');
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder userMainCard">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h4 class="card-title noPadding">' + value['name'] + '</h4>\n' +
                    '        <p class="card-text">@' + value['screen_name'] + ', '+closedState+'</p>\n' +
                    '    </div>\n' +
                    '</div>');
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder userMainCard">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <h4 class="card-title noPadding smallTitle">Информация</h4>\n' +
                    '        <p class="card-text">' + description + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
            logInfo("GroupInfo", "Finish GroupInfo");
        }
    });
}