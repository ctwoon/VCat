var musicToken = getItem('libvkmusic_token');

function getMusic() {
    logInfo("Music", "Get Music");
    var url;
    var offset = 0;
    url = craftAudioMethodURL('execute', 'getMusicPage', 'owner_id='+getItem("userId")+"&need_owner=1&need_playlists=1&playlists_count=12&audio_offset="+offset+"&audio_count=100", '5.74');
    logInfo("Music", "Requesting url: "+url);
    $.ajax({
        url: url,
        success: function( response ) {
            $('.spinnerLoad').hide();
            logInfo("Music", "Got audio list");
            var result = JSON.parse(response);
            $.each(result['response']['audios']['' + 'items'], function (index, value) {
                var quality = "Среднее качество";
                if (value['is_hq']) {
                    quality = "Высокое качество";
                }
                var durMin = Math.floor(value['duration'] / 60);
                var durSec = value['duration'] - durMin*60;
                $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder audio" vcat-audiourl="'+value['url']+'">\n' +
                    '    <div class="card-body messagePadding">\n' +
                    '<h4 class="card-title smallTitle">'+value['artist']+' - '+value['title']+'</h4>' +
                    '<p class="card-text">'+quality+' / '+durMin+':'+durSec+'</p>' +
                    '</div>' +
                    '    </div>\n' +
                    '</div>');
            });
            $('.audio').click(function() {
                window.open($(this).attr('vcat-audiourl'));
            });
            console.log(result);
        }
    });
}

function craftAudioMethodURL(methodType, methodName, methodParams, apiVersion) {
    return craftURL('https://api.vk.com/method/'+methodType+'.'+methodName+'?access_token='+musicToken+'&'+methodParams+'&v='+apiVersion);
}

function generateMusic() {
    if (!musicToken) {
        logInfo("Music", "Requesting token...");
        getToken();
    }
}

function getToken() {
    var url = "libvkmusic/index.php";
    $.ajax({
        url: url,
        success: function( response ) {
            console.log("Got token:" + response);
            refreshToken(response);
        }
    });
}

function refreshToken(receipt) {
    logInfo("Music", "Refreshing token");
    var url = craftMethodURL('auth', 'refreshToken', 'receipt='+receipt, '5.74');
    $.ajax({
        url: url,
        success: function( response ) {
            var result = JSON.parse(response);
            setItem('libvkmusic_token', result['response']['token']);
        }
    });
}

generateMusic();