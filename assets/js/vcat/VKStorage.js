function VKStorageKeys() {
    logInfo("User", "Get User");
    var url = "https://api.vk.com/method/storage.getKeys?global=0&user_id="+user_id+"&access_token="+token+"&count=999&offset=0&v=5.74";
    url = craftURL(url);
    $('.cardContainer').html('<center class="spinnerLoad"><div class="spinner"></div></center>');
    $.ajax({
        url: url,
        success: function( response ) {
            console.log(response);
        }
    });
}