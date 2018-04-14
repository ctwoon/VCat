var widget = {
    widget_codename: "testwidget",
    widget_name: "Виджет",
    start: function () {
        uiw_setTitle(this.widget_name);
        uiw_setData("<b>Привет!</b><br>Это <b>окно виджетов</b>.<br><i>Виджет</i> - маленькая программа, которая находится в панели справа и выполняет свою функцию.<br>При этом виджет может работать с <b>функциями сайта</b> и быть написанным на <b>JavaScript</b>.");
    }
};