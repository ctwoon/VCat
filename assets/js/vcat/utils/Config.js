function initConfig() {
    offlineMode = getItem('app_offline');
    enlargeText = getItem('app_vk5post');
    allowLongpoll = getItem('app_longpoll');
    useProxy = getItem('app_useproxy');
    proxyURL = getItem('app_proxyurl');
    darkMode = getItem('app_darkmode');
    liteMode = getItem('app_litemode');
    blurMode = getItem('app_blur');
    backgroundPhotoPicture = getItem('app_background_photo');
    if (!offlineMode) {
        setItem('app_offline', 'disabled');
        offlineMode = 'disabled';
    }
    if (!enlargeText) {
        setItem('app_vk5post', 'disabled');
        enlargeText = 'disabled';
    }
    if (!allowLongpoll) {
        setItem('app_longpoll', 'enabled');
        allowLongpoll = 'enabled';
    }
    if (!useProxy) {
        setItem('app_useproxy', 'disabled');
        useProxy = 'disabled';
    }
    if (!liteMode) {
        setItem('app_litemode', 'disabled');
        liteMode = 'disabled';
    }
    if (!proxyURL) {
        setItem('app_proxyurl', 'http://vcatclient.000webhostapp.com/proxy.php');
        proxyURL = 'http://vcatclient.000webhostapp.com/proxy.php';
    }
}

function getThemesInConfig() {
  logInfo("Config", "Get Themes");
  location.hash = "configThemes";
    $.getJSON("assets/themes.json", function (json) {
        var currentTheme = getItem('config_theme');
        logInfo("Config", "Got Themes JSON");
        $.each(json['officalThemes'], function (index, value) {
            var isApply = "";
            if (value['themePath'] == currentTheme) {
                isApply = " (установлено)";
            }
            $(".cardContainer").append(
                "<div vcat-themePath=\"" + value['themePath'] + "\" vcat-themeName=\"" + value['themeName'] + "\" class=\"cardForceNoPadding pointer card cardDecor semi-transparent themeSwitch postCard message messageBorder\">\n" +
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
            );
        });

        $(".themeSwitch").click(function () {
            var themePath = $(this).attr('vcat-themePath');
            var themeName = $(this).attr('vcat-themeName');
            setItem('config_theme', themePath);
            setItem('config_theme_name', themeName);
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

        $(".back").click(function () {
            getSettings();
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
    var cfg3 = "отключено";
    var cfg3a = 'enabled';
    if (allowLongpoll == "enabled") {
        cfg3 = 'включено';
        cfg3a = 'disabled';
    }
    var cfg4 = "отключено";
    var cfg4a = 'enabled';
    if (useProxy == "enabled") {
        cfg4 = 'включено';
        cfg4a = 'disabled';
    }
    var cfg5 = "отключено";
    var cfg5a = 'enabled';
    if (liteMode == "enabled") {
        cfg5 = 'включено';
        cfg5a = 'disabled';
    }
    //
    var cfg6 = "отключено";
    var cfg6a = 'enabled';
    if (blurMode == "enabled") {
        cfg6 = 'включено';
        cfg6a = 'disabled';
    }
    //
    themeName = getItem("config_theme_name");
    addSCategory('Интерфейс');
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder themes">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">Темы</h5>\n' +
        '        <p class="card-text">Текущая тема: '+themeName+'</p>\n' +
        '    </div>\n' +
        '</div>');
    addSSimpleOption("app_offline", cfg1a, cfg1, "Оффлайн-режим", "Включает режим \"вне сети\". Это может не сработать в ряде случаев.");
    addSSimpleOption("app_vk5post", cfg2a, cfg2, "Увеличение текста", "Увеличение текста в ленте новостей, если в нем нет вложений.");
    addSCategory('Основное');
    addSSimpleOption("app_longpoll", cfg3a, cfg3, "Использовать Long Polling", "Динамическое обновление сообщений. Отключите для повышения стабильности.");
    addSSimpleOption("app_useproxy", cfg4a, cfg4, "Удаленный прокси", "Использовать удаленный прокси вместо серверного. Это может повлиять на работу приложения.");
    addSSimpleOption("app_litemode", cfg5a, cfg5, "Легкий режим", "Данная опция отключает показ фотографий и предпросмотр.");
    addSClassOption("configSetProxyURL", "URL удаленного прокси", "Используется: "+proxyURL);
    addSCategory('Интерфейс');
    addSSimpleOption("app_blur", cfg6a, cfg6, "Режим размытия (бета)", "Для работы включите 'Experimental Web Platform features' в Chrome. Поддержка Chrome, Safari, Edge. Для применения изменений перезагрузите страницу.");
    addSClassOption("configSetBgPic", "Фоновая картинка (для отключения - 'disabled')", "Используется: "+backgroundPhotoPicture);
    addSCategory('Информация');
    addSClassOption("about", "О VCat", "Текущая версия: "+VCAT_VERSION);
    addSClassOption("logoutButton", "Сбросить данные VCat", "Это удалит все - от данных входа до мультиаккаунтов.");
    addSClassOption("transfer", "Перенос аккаунта", "Перенос данных аккаунта между зеркалами VCat.");
    //

    $(".configSet").click(function () {
        setConfig($(this).attr('vcat-shouldon'), $(this).attr('vcat-config'));
    });
    $(".configSetProxyURL").click(function () {
        var a = prompt("URL прокси:", proxyURL);
        setConfig(a, "app_proxyurl");
    });
    $(".configSetBgPic").click(function () {
        var a = prompt("URL фоновой картинки:", backgroundPhotoPicture);
        setConfig(a, "app_background_photo");
    });
    $(".themes").click(function () {
        $('.htmlContainer').html("<div class='cardContainer'></div>");
        getThemesInConfig();
    });
    $(".about").click(function () {
        location.hash = "configAbout";
        switchToPage('.navAppConfig', 'itemAbout.html');
    });
    $(".transfer").click(function () {
        location.hash = "configTransfer";
        switchToPage('.navAppConfig', 'itemTransfer.html');
    });
    $(".logoutButton").click(function () {
      localStorage.clear();
      window.location.href = "index.html";
    });
}

function addSCategory(categoryName) {
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder">\n' +
        '    <div class="card-body category">\n' +
        '        <p class="card-text">'+categoryName+'</p>\n' +
        '    </div>\n' +
        '</div>');
}

function addSSimpleOption(vcatConfig,vcatShouldOn,vcatConfigOn,optionTitle,optionDesc) {
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder configSet pointer" vcat-config="'+vcatConfig+'" vcat-shouldon="'+vcatShouldOn+'">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">'+optionTitle+' ('+vcatConfigOn+')</h5>\n' +
        '        <p class="card-text">'+optionDesc+'</p>\n' +
        '    </div>\n' +
        '</div>');
}

function addSClassOption(className, optionTitle, optionDesc) {
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder '+className+' pointer">' +
        '    <div class="card-body messagePadding">' +
        '        <h5 class="card-title noPadding smallTitle">'+optionTitle+'</h5>'  +
        '        <p class="card-text">'+optionDesc+'</p>' +
        '    </div>' +
        '</div>');
}

function setConfig(check, key) {
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
