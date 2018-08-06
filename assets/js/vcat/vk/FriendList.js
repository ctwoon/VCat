function getFriends() {
    var url = "https://api.vk.com/method/friends.get?user_id="+user_id+"&access_token="+token+"&v=5.73&order=hints&fields=photo_100&count=9000&offset=0";
    url = craftURL(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = safeParse(response);
            $.each(result['response']['items'],function(index, value){
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder showUser" vcat-userid="'+value['id']+'">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '        <p class="card-text">' + value['first_name'] + ' ' + value['last_name'] + '</p>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
            $(".showUser").click(function () {
                logError($(this).attr('vcat-userid'));
                getUser($(this).attr('vcat-userid'));
            });
        }
    });
}
