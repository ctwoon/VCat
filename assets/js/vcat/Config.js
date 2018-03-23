function getThemesInConfig() {
  logInfo("Config", "Get Themes");
    $.getJSON("assets/themes.json", function (json) {
        var currentTheme = getItem('config_theme');
        logInfo("Config", "Got Themes JSON");
        $.each(json['officalThemes'], function (index, value) {
            var isApply = "";
            if (value['themePath'] == currentTheme) {
                isApply = " (установлено)";
            }
            $(".themePlace").append(
                "<div vcat-themePath=\"" + value['themePath'] + "\" class=\"card cardDecor semi-transparent themeSwitch message messageBorder\">\n" +
                " <div class=\"card-body\">\n" +
                " <p class=\"card-text\">\n" +
                value['themeName'] + isApply +
                " </p>\n" +
                " <p class=\"card-text\">\n" +
                value['themeDescription'] +
                " </p>\n" +
                " <p class=\"card-text\">\n<i>От " +
                value['themeAuthor'] +
                " </i></p>\n" +
                " </div>\n" +
                " </div>"
            )
        });

        $(".themeSwitch").click(function () {
            var themePath = $(this).attr('vcat-themePath');
            setItem('config_theme', themePath);
            logInfo("Config", "Set Theme to "+themePath);
            bootbox.confirm({
                message: "Тема установлена. Для применения изменений перезагрузите страницу.",
                buttons: {
                    confirm: {
                        label: 'Перезагрузить',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Позже',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        window.location.href = "main.html";
                    }
                }
            });
        });

        logInfo("Config", "Finish Themes");
    });
}
