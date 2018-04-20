var AlertWidget = {
    widget_codename: "alert",
    widget_name: "Уведомления",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, "<b>Привет!</b><br>Этот виджет нужен для показа уведомлений, связаных с VCat. <br>Он будет <i>обновляться по мере появления новых записей</i>.");
    },
    getAlert: function () {

    }
};

AlertWidget.init();