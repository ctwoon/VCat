function getMusic() {
    logInfo("Music", "Get Music");
    var url;
    var offset = 0;
    url = craftMethodURL('execute', 'getMusicPage', 'owner_id='+getItem("userId")+"&need_owner=1&need_playlists=1&playlists_count=12&audio_offset="+offset+"&audio_count=100", '5.74');
    logInfo("Music", "Requesting url: "+url);
    $.ajax({
        url: url,
        success: function( response ) {
            logInfo("Music", "Got audio list");
            try {
                var result = JSON.parse(response);
                if (result['execute_errors'] !== undefined) {
                    if (result['execute_errors'][0]['error_code'] == 25) {
                        refreshToken();
                    }
                    if (result['execute_errors'][0]['error_code'] == 9) {
                        showLoadError(9, 'Flood control', 'Слишком много запросов, повторите попытку через 2-3 минуты.')
                    }
                } else {
                    $('.spinnerLoad').hide();
                    $.each(result['response']['audios']['' + 'items'], function (index, value) {
                        var quality = "Среднее качество";
                        if (value['is_hq']) {
                            quality = "Высокое качество";
                        }
                        var durMin = Math.floor(value['duration'] / 60);
                        var durSec = value['duration'] - durMin * 60;
                        $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder audio" vcat-audiotext="' + value['artist'] + ' - ' + value['title'] + '" vcat-audiourl="' + value['url'] + '">\n' +
                            '    <div class="card-body messagePadding">\n' +
                            '<h4 class="card-title smallTitle">' + value['artist'] + ' - ' + value['title'] + '</h4>' +
                            '<p class="card-text">' + quality + ' / ' + durMin + ':' + durSec + '</p>' +
                            '</div>' +
                            '    </div>\n' +
                            '</div>');
                    });
                    $('.audio').click(function () {
                        //window.open($(this).attr('vcat-audiourl'));
                        MusicWidget.setAudioSource($(this).attr('vcat-audiourl'), $(this).attr('vcat-audiotext'));
                    });
                    console.log(result);
                }
            } catch (e) {
                showLoadError(1000, "Ошибка возвращаемых данных", "Проблема с прокси и/или пустые аудиозаписи.");
            }
        }
    });
}

function refreshToken() {
    $.ajax({
        url: "https://utkacraft.ru/vcat/gcmtoken/",
        success: function(response) {
            logInfo("Music", "Got token: "+response);
            var gcmtoken = response;
            $.ajax({
                url: craftMethodURL("auth", "refreshToken", "receipt="+gcmtoken, "5.74"),
                success: function(response) {
                    logInfo("Music", "Got response: "+response);
                    var res = JSON.parse(response);
                    setItem('authToken', res['response']['token']);
                    token = res['response']['token'];
                    getMusic();
                }
            });
        }
    });
}
