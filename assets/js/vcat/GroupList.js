function getGroups() {
  logInfo("GroupList", "Get GroupList");
    var url = "https://api.vk.com/method/groups.get?user_id="+user_id+"&extended=1&access_token="+token+"&v=5.73&count=999";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
          logInfo("GroupList", "Got GroupList JSON");
            var result = JSON.parse(response);
            logInfo(response);
            $.each(result['response']['items'],function(index, value){
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder showGroup" vcat-groupid="'+value['id']+'">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <p class="card-text">' + value['name'] + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
            $(".showUser").click(function () {
                /*logError($(this).attr('vcat-userid'));
                getUser($(this).attr('vcat-userid'));*/
            });
            logInfo("GroupList", "Finish GroupList");
        }
    });
}
