var VCNewsWidget = {
    widget_codename: "sidebarwidget",
    widget_name: "Параметры",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, "TODO");
    }
};

VCNewsWidget.init();
