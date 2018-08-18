function initConfig() {
    let configs = [
        {
            name: "app_offline",
            variable: "offlineMode",
            default: "disabled"
        },
        {
            name: "app_vk5post",
            variable: "enlargeText",
            default: "enabled"
        },
        {
            name: "app_longpoll",
            variable: "allowLongpoll",
            default: "enabled"
        },
        {
            name: "app_useproxy",
            variable: "useProxy",
            default: "disabled"
        },
        {
            name: "app_litemode",
            variable: "liteMode",
            default: "disabled"
        },
        {
            name: "app_proxyurl",
            variable: "proxyURL",
            default: "http://vcatclient.000webhostapp.com/proxy.php"
        },
        {
            name: "app_blur",
            variable: "blurMode",
            default: "disabled"
        },
        {
            name: "app_background_photo",
            variable: "backgroundPhotoPicture",
            default: "disabled"
        },
        {
            name: "app_hidestories",
            variable: "hideStories",
            default: "disabled"
        },
        {
            name: "app_showactivity",
            variable: "showPostActivity",
            default: "enabled"
        }
    ];
    configs.forEach(function (value) {
        window[value['variable']] = getItem(value['name']);
        if (!window[value['variable']]) {
            setItem(value['name'], value['default']);
            window[value['variable']] = value['default'];
        }
    });
}

function getThemesInConfig() {
  location.hash = "configThemes";
    $.getJSON("assets/themes.json", function (json) {
        var currentTheme = getItem('config_theme');
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
            requestReload();
        });

        $(".back").click(function () {
            getSettings();
        });

    });
}

function getSettings() {
    $('.htmlContainer').html("<div class='cardContainer'></div>");
    themeName = getItem("config_theme_name");
    addSCategory('Интерфейс');
    addSClassOption("themes", "Темы", "Текущая тема: "+themeName, function () {
        $('.htmlContainer').html("<div class='cardContainer'></div>");
        getThemesInConfig();
    });
    addSSimpleOption("app_blur", "Режим размытия (бета)", "Для работы включите 'Experimental Web Platform features' в Chrome. Поддержка Chrome, Safari, Edge. Для применения изменений перезагрузите страницу.");
    addSClassOption("configSetBgPic", "Фоновая картинка (для отключения - 'disabled')", "Используется: "+backgroundPhotoPicture, function () {
        var a = prompt("URL фоновой картинки:", backgroundPhotoPicture);
        if (!a) {
            a = "disabled";
        }
        setConfig(a, "app_background_photo");
    });
    addSSimpleOption("app_vk5post", "Увеличение текста", "Увеличение текста в ленте новостей, если в нем нет вложений.");
    addSSimpleOption("app_hidestories", "Скрыть истории", "Не показывать истории в ленте новостей.");
    addSSimpleOption("app_showactivity", "Показывать активность поста", "Если функция включна, то при наличии последнего комментария VCat его покажет.");
    addSDivider();
    addSCategory('Основное');
    addSSimpleOption("app_longpoll", "Использовать Long Polling", "Динамическое обновление сообщений. Отключите для повышения стабильности .");
    //addSSimpleOption("app_useproxy", "Удаленный прокси", "Использовать удаленный прокси. Это может повлиять на работу приложения. (Встроенный прокси не работает с опросами 2.0 и музыкой, но удаленный прокси не умеет работать с картиками в странах с блокировкой ВК)");
    addSSimpleOption("app_litemode", "Легкий режим", "Данная опция отключает показ фотографий и предпросмотр.");
    //addSClassOption("configSetProxyURL", "URL удаленного прокси", "Используется: "+proxyURL, function () {
    //    var a = prompt("URL прокси:", proxyURL);
    //    setConfig(a, "app_proxyurl");
    //});
    addSSimpleOption("app_offline", "Оффлайн-режим", "Включает режим \"вне сети\". Это может не сработать в ряде случаев.");
    addSDivider();
    addSCategory('Информация');
    addSClassOption("about", "О VCat", "Текущая версия: "+VCAT_VERSION, function () {
        location.hash = "configAbout";
        switchToPage('.navAppConfig', 'itemAbout.html');
    });
    addSClassOption("logoutButton", "Сбросить данные VCat", "Это удалит все - от данных входа до мультиаккаунтов.", function () {
        localStorage.clear();
        window.location.href = "index.html";
    });

    $(".configSet").click(function () {
        setConfig($(this).attr('vcat-shouldon'), $(this).attr('vcat-config'));
    });
}

function addSCategory(categoryName) {
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder">\n' +
        '    <div class="card-body category">\n' +
        '        <p class="card-text attachment-title">'+categoryName+'</p>\n' +
        '    </div>\n' +
        '</div>');
}

function addSDivider() {
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder">\n' +
        '    <div class="card-body card-divider">\n' +
        '    </div>\n' +
        '</div>');
}

function addSSimpleOption(vcatConfig,optionTitle,optionDesc) {
    let cfg = "отключено";
    let cfga = 'enabled';
    if (getItem(vcatConfig) === "enabled") {
        cfg = 'включено';
        cfga = 'disabled';
    }

    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder configSet pointer" vcat-config="'+vcatConfig+'" vcat-shouldon="'+cfga+'">\n' +
        '    <div class="card-body messagePadding">\n' +
        '        <h5 class="card-title noPadding smallTitle">'+optionTitle+' ('+cfg+')</h5>\n' +
        '        <p class="card-text">'+optionDesc+'</p>\n' +
        '    </div>\n' +
        '</div>');
}

function addSClassOption(className, optionTitle, optionDesc, onClick) {
    $('.cardContainer').append('<div class="cardForceNoPadding card cardDecor semi-transparent postCard message messageBorder '+className+' pointer">' +
        '    <div class="card-body messagePadding">' +
        '        <h5 class="card-title noPadding smallTitle">'+optionTitle+'</h5>'  +
        '        <p class="card-text">'+optionDesc+'</p>' +
        '    </div>' +
        '</div>');
    $("."+className).click(function () {
        onClick();
    });
}

function setConfig(check, key) {
    setItem(key, check);
    initConfig();
    $('.htmlContainer').html("");
    getSettings();
}

function requestReload() {
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
}
