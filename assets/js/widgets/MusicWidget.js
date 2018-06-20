var MusicWidget = {
    widget_codename: "music",
    audio: new Audio(),
    isEnabled: false,
    isPlaying: true,
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
            '   <div class="btn-group" role="group" style="margin-top: 10px;">' +
            '   <button class="btn btn-outline-primary toggleAudio btn-sm">◼</button>' +
            '  </div></div>\n' +
            '</div>');
        $(".toggleAudio").click(function () {
            if (MusicWidget.isPlaying) {
                MusicWidget.pause();
            } else {
                MusicWidget.playAudio();
            }
        });
        $('.audioText').html(text);
    },
    pause: function () {
        $(".toggleAudio").html("▶");
        this.isPlaying = false;
        this.audio.pause();
    },
    playAudio: function () {
        $(".toggleAudio").html("◼");
        this.isPlaying = true;
        this.audio.play();
    }
};

MusicWidget.init();
