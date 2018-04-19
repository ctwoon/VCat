var MusicWidget = {
    widget_codename: "music",
    widget_name: "Аудиовиджет",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, '<div class="audio-player">\n' +
            '  <div class="audio-wrapper" id="player-container" href="javascript:;">\n' +
            '    <audio id="player" ontimeupdate="initProgressBar()">\n' +
            '      <source id="audioSource" type="audio/mp3">\n' +
            '    </audio>\n' +
            '  </div>\n' +
            '  <div class="player-controls scrubber">\n' +
            '    <p class="audioText">...</p>\n' +
            '    <span id="seek-obj-container">\n' +
            '      <progress id="seek-obj" value="0.4" max="1"></progress>\n' +
            '    </span>\n' +
            '  </div>\n' +
            '</div>');
    },
    setAudioSource: function (sourceURL, text) {
        $('#audioSource').attr('src', sourceURL);
        $('.audioText').html(text);
    }
};

MusicWidget.init();
