function initConfig() {
    offlineMode = getItem('app_offline');
    enlargeText = getItem('app_vk5post');
    if (!offlineMode) {
        setItem('app_offline', 'disabled');
        offlineMode = 'disabled';
        logInfo("Config", "Offline mode not set! Setting to disabled");
    } else {
        logInfo("Config", "Offline mode is available - "+offlineMode);
    }
    if (!enlargeText) {
        setItem('app_vk5post', 'disabled');
        enlargeText = 'disabled';
        logInfo("Config", "Enlarge text mode not set! Setting to disabled");
    } else {
        logInfo("Config", "Enlarge text mode is available - "+enlargeText);
    }
}

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
            themes_loadTheme(themePath);
            logInfo("Config", "Set Theme to "+themePath);
            bootbox.confirm({
                message: "Тема установлена. Рекомендуем перезагрузить страницу.",
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
    var cfg1a = 'enabled';
    if (offlineMode == "enabled") {
        cfg1 = 'включено';
        cfg1a = 'disabled';
    }
    var cfg2 = "отключено";
    var cfg2a = 'enabled';
    if (enlargeText == "enabled") {
        cfg2 = 'включено';
        cfg2a = 'disabled';
    }
    $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder configSet" vcat-config="app_offline" vcat-shouldon="'+cfg1a+'">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">Оффлайн-режим ('+cfg1+')</h5>\n' +
        '        <p class="card-text">Включает режим "вне сети". Это может не сработать в ряде случаев.</p>\n' +
        '    </div>\n' +
        '</div>');
    $('.cardContainer').append('<div class="card cardDecor semi-transparent postCard message messageBorder configSet" vcat-config="app_vk5post" vcat-shouldon="'+cfg2a+'">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">Увеличение текста ('+cfg2+')</h5>\n' +
        '        <p class="card-text">Увеличение текста в ленте новостей, если в нем нет вложений.</p>\n' +
        '    </div>\n' +
        '</div>');
    //

    $(".configSet").click(function () {
        setConfig($(this).attr('vcat-shouldon'), $(this).attr('vcat-config'));
    });

}

function setConfig(check, key) {
    console.log(check);
    setItem(key, check);
    logInfo("Config", "Set "+key+" to "+check);
    initConfig();
    $('.htmlContainer').html("");
    getSettings();
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
