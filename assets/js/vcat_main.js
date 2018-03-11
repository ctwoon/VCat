/** VCat Main **/
var token = getItem("authToken");

function getNews() {
    /*$.ajax({
        url: "http://SOSI/proxy.php?url=\"https://api.vk.com/method/newsfeed.get?access_token="+token+"&filters=post\"",
        success: function( response ) {
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                console.log('My array has at position ' + index + ', this value: ' + value['text']);
            });
        }
    });*/
}