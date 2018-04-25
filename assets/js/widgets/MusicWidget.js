var MusicWidget = {
    widget_codename: "music",
    audio: new Audio(),
    isEnabled: false,
    url: "",
    title: "",
    widget_name: "Аудиовиджет",
    init: function () {

    },
    setAudioSource: function (sourceURL, text) {
        if (!this.isEnabled) {
            this.isEnabled = true;
            uiw_addWidgetBlock(this.widget_codename);
            uiw_setTitle(this.widget_codename, this.widget_name);
        }
        this.audio.pause();
        this.audio = new Audio(sourceURL);
        this.audio.play();
        this.url = sourceURL;
        this.title = text;
        uiw_setData(this.widget_codename, '<div class="audio-player">\n' +
            '  <div class="player-controls scrubber">\n' +
            '    <p class="audioText">...</p>' +
            '   <div class="btn-group" role="group" style="margin-top: 10px;"><button class="btn btn-outline-primary pauseAudio btn-sm">◼</button>' +
            '   <button class="btn btn-outline-primary playAudio btn-sm">▶</button>' +
            '   <button class="btn btn-outline-primary downloadAudio btn-sm">⬇</button>' +
            '  </div></div>\n' +
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
