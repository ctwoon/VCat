/** VCat Main **/
var token = getItem("authToken");
var debug = true;
function getNews() {
    var url = "https://api.vk.com/method/newsfeed.get?access_token="+token+"&filters=post&v=5.73";
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                if (value['text'].length !== 0) {
                    var b = getGroupID(Math.abs(value['source_id']));
                    //console.log(b);
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent">\n' +
                        '    <div class="card-body">\n' +
                        '        <h5 class="card-title">' + b + '</h5>\n' +
                        '        <p class="card-text">' + value['text'] + '</p>\n' +
                        '    </div>\n' +
                        '</div>');
                }
            });
            $('.spinnerLoad').hide()
        }
    });
}

function getGroupID(source_id) {
    var url = "https://api.vk.com/method/groups.getById?access_token="+token+"&group_id="+source_id+"&v=5.73";
    var result;
    if (!debug) {
        url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    } else {
        url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
    }
    $.ajax({
        url: url,
        async: false,
        success: function( response ) {
            result = JSON.parse(response);
        }
    });
    return result['response'][0]['name'];
}