/** VCat Main **/
var token = getItem("authToken");

function getNews() {
    $.ajax({
        url: "http://vcatclient.000webhostapp.com/proxy.php?method=getNewsfeed&token="+token,
        success: function( response ) {
            var result = JSON.parse(response);
            $.each(result['response']['items'],function(index, value){
                console.log('My array has at position ' + index + ', this value: ' + value['text']);
            });
        }
    });
}