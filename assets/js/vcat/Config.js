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
                " <div class=\"card-body messagePadding\">\n" +
                " <h5 class=\"card-text noPadding smallTitle\">\n" +
                value['themeName'] + isApply +
                " </h5>\n" +
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

function getSettings() {
    $('.htmlContainer').html("<div class='cardContainer'></div>");
    var cfg1 = "отключено";
    var cfg1a = true;
    if (offlineMode == "enabled") {
        cfg1 = 'включено';
        cfg1a = false;
    }
    $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder configOffline">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">Оффлайн-режим ('+cfg1+')</h5>\n' +
        '        <p class="card-text">Включает режим "вне сети". Это может не сработать в ряде случаев.</p>\n' +
        '    </div>\n' +
        '</div>');

    //

    $(".configOffline").click(function () {
        var result = 'disabled';
        if (cfg1a) {
            result = "enabled";
        }
        setItem('app_offline', result);
        logInfo("Config", "Set Offline to "+result);
        offlineMode = result;
        $('.htmlContainer').html("");
        getSettings();
    });

}

function requestReload() {
    bootbox.confirm({
        message: "Настройка установлена. Для применения изменений перезагрузите страницу.",
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
}
