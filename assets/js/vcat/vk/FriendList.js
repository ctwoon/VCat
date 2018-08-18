function getFriends() {
    sendData("friends", "get", "user_id="+user_id+"&order=hints&fields=photo_100&count=9000&offset=0", "5.83", function (result) {
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
    });
}
