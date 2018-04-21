var MusicWidget = {
    widget_codename: "music",
    audio: new Audio(),
    url: "",
    title: "",
    widget_name: "Аудиовиджет",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, '<div class="audio-player">\n' +
            '  <div class="player-controls scrubber">\n' +
            '    <p class="audioText">...</p>' +
            '   <button class="btn btn-outline-info pauseAudio">Pause</button>' +
            '   <button class="btn btn-outline-info playAudio">Play</button>' +
            '   <button class="btn btn-outline-info downloadAudio">Download</button>' +
            '  </div>\n' +
            '</div>');
        $(".pauseAudio").click(function () {
            MusicWidget.pause();
        });
        $(".playAudio").click(function () {
            MusicWidget.playAudio();
        });
        $(".downloadAudio").click(function () {
            MusicWidget.downloadAudio();
        });
    },
    setAudioSource: function (sourceURL, text) {
        this.audio.pause();
        this.audio = new Audio(sourceURL);
        this.audio.play();
        this.url = sourceURL;
        this.title = text;
        $('.audioText').html(text);
    },
    pause: function () {
        this.audio.pause();
    },
    playAudio: function () {
        this.audio.play();
    },
    downloadAudio: function () {
        window.open(craftMusicURL(this.url, this.title));
    }
};

MusicWidget.init();
