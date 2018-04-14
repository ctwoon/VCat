var musicToken = getItem('libvkmusic_token');

function getMusic() {
    logInfo("Music", "Get Music");
    var url;
    var offset = 0;
    url = craftMethodURL('execute', 'getMusicPage', 'owner_id='+getItem("userId")+"&need_owner=1&need_playlists=1&playlists_count=12&audio_offset="+offset+"&audio_count=100", '5.74');
    logInfo("Music", "Requesting url: "+url);
    $.ajax({
        url: url,
        success: function( response ) {
            $('.loading').hide();
            logInfo("Music", "Got audio list: "+response);
            var result = JSON.parse(response);
            if (!musicToken) {
                logInfo("Music", "Requesting token...");
                getToken();
            }
        }
    });
}

function getToken() {
    var url = "libvkmusic/index.php";
    $.ajax({
        url: url,
        success: function( response ) {
            console.log("Got token:" + response);
            setItem('libvkmusic_token', response);
        }
    });
}

getMusic();