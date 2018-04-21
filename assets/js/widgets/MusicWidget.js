var MusicWidget = {
    widget_codename: "music",
    audio: new Audio(),
    widget_name: "Аудиовиджет",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, '<div class="audio-player">\n' +
            '  <div class="player-controls scrubber">\n' +
            '    <p class="audioText">...</p>' +
            '   <button class="btn btn-outline-info pauseAudio">Pause</button>' +
            '   <button class="btn btn-outline-info playAudio">Play</button>' +
            '  </div>\n' +
            '</div>');
        $(".pauseAudio").click(function () {
            MusicWidget.pause();
        });
        $(".playAudio").click(function () {
            MusicWidget.playAudio();
        });
    },
    setAudioSource: function (sourceURL, text) {
        this.audio.pause();
        this.audio = new Audio(sourceURL);
        this.audio.play();
        $('.audioText').html(text);
    },
    pause: function () {
        this.audio.pause();
    },
    playAudio: function () {
        this.audio.play();
    }
};

MusicWidget.init();
