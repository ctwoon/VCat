var VCNewsWidget = {
    widget_codename: "news",
    widget_name: "Новости VCat",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, "Ожидание...");
        uiw_destroyWidget(this.widget_codename);
    }
};

VCNewsWidget.init();