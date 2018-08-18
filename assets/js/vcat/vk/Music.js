function getMusic() {
    let url;
    let offset = 0;
    sendData('audio', 'get', "audio_offset="+offset+"&audio_count=100&need_playlists=1", '5.84', parseMusic);
}

function refreshToken() {
    $.ajax({
        url: "https://utkacraft.ru/vcat/gcmtoken/",
        success: function(response) {
            let gcmtoken = response;
            sendAlternateData("auth", "refreshToken", "receipt="+gcmtoken, "5.74", function (data) {
                console.error(data);
                setItem('authToken', data['response']['token']);
                token = data['response']['token'];
                getMusic();
            });
        }
    });
}

let musicIntroShown = getItem("app_musicintroshown");
if (!musicIntroShown) {
    musicIntroShown = "disabled";
    setItem("app_musicintroshown", "disabled");
}

function parseMusic(result) {
    if (useProxy == "disabled") {
        switchToPage('.navMusic', 'itemAudioPlaceholder.html');
    } else {
        try {
            if (result['error'] !== undefined) {
                if (result['error']['error_code'] == 25) {
                    refreshToken();
                }
                if (result['error']['error_code'] == 9) {
                    showLoadError(9, 'Flood control', 'Слишком много запросов, повторите попытку через 2-3 минуты.')
                }
            } else {
                $('.spinnerLoad').hide();
                $.each(result['response']['items'], function (index, value) {
                    let quality = "Среднее качество";
                    if (value['is_hq']) {
                        quality = "Высокое качество";
                    }
                    var durMin = Math.floor(value['duration'] / 60);
                    var durSec = value['duration'] - durMin * 60;
                    var durMin = String(durMin).padStart(2, 0);
                    var durSec = String(durSec).padStart(2, 0);
                    $('.cardContainer').append('<div class="card cardDecor semi-transparent message messageBorder audio" vcat-audiotext="' + value['artist'] + ' - ' + value['title'] + '" vcat-audiourl="' + value['url'] + '">\n' +
                        '    <div class="card-body messagePadding">\n' +
                        '<h4 class="card-title smallTitle">' + value['artist'] + ' - ' + value['title'] + '</h4>' +
                        '<p class="card-text">' + quality + ' / ' + durMin + ':' + durSec + '</p>' +
                        '</div>' +
                        '    </div>\n' +
                        '</div>');
                    getPlaylists();
                });
                $('.audio').click(function () {
                    MusicWidget.setAudioSource($(this).attr('vcat-audiourl'), $(this).attr('vcat-audiotext'));
                });
            }
        } catch (e) {
            showLoadError(1000, "Ошибка возвращаемых данных", "Проблема с прокси и/или пустые аудиозаписи.");
        }
    }
}

function getPlaylists() {
    sendData("audio", "getPlaylists", "owner_id="+getItem("VCat.Auth.UserID"), "5.83", parsePlaylists);
}

function parsePlaylists(data) {
    console.log(data);
}
