function getMusic() {
    logInfo("Music", "Get Music");
    var url;
    var offset = 0;
    url = craftMethodURL('execute', 'getMusicPage', 'owner_id='+getItem("userId")+"&need_owner=1&need_playlists=1&playlists_count=12&audio_offset="+offset+"&audio_count=100", '5.74');
    logInfoNew("Requesting url: "+url);
    $.ajax({
        url: url,
        success: function( response ) {
            $('.loading').hide();
            logInfoNew("Got audio: "+response);
        }
    });
}

getMusic();