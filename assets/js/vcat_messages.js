/** VCat Main **/
var token = getItem("authToken");
var user_id = getItem("userId");
if (!token) {
    window.location.href="index.html";
}

function getFriends() {
    var url;
    url = "https://api.vk.com/method/friends.get?user_id="+user_id+"&access_token="+token+"&v=5.73&order=hints&fields=photo_100&count=9000&offset=0";
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    console.log(url);
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
              $('.cardContainer').append('<div class="card cardDecor semi-transparent">\n' +
                  '    <div class="card-body">\n' +
                  '        <img class="friendFloat" src="'+value['photo_100']+'">' +
                  '        <p class="card-text">' + value['first_name'] + ' ' + value['last_name'] + '</p>\n' +
                  '    </div>\n' +
                  '</div>');
            });
            feather.replace();
            $('.spinnerLoad').hide();
        }
    });
}
