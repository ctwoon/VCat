function getGroups() {
    sendData("groups", "get", "user_id="+user_id+"&extended=1&count=900", "5.83", function (result) {
        $.each(result['response']['items'],function(index, value){
            var gt;
            switch (value['type']) {
                case 'page':
                    gt = "Страница";
                    break;
                case 'group':
                    gt = "Группа";
                    break;
            }
            $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder showGroup" vcat-groupid="'+value['id']+'">\n' +
                '    <div class="card-body messagePadding">\n' +
                '        <p class="card-text">' + value['name'] + '</p>\n' +
                '        <p class="card-text">' + gt + '</p>' +
                '    </div>\n' +
                '</div>');
        });
        feather.replace();
        $('.spinnerLoad').hide();
        $(".showGroup").click(function () {
            getGroupInfo($(this).attr('vcat-groupid'));
        });
    });
}

function getGroupInfo(groupID) {
    var fields = "id,name,screen_name,description";
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    sendData("groups", "getById", "group_ids="+groupID+"&fields="+fields, "5.83", function (result) {
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
            var id = value['id'];
            getUserWall(-id, value['name']);
        });
        feather.replace();
        $('.spinnerLoad').hide();
    });
}
