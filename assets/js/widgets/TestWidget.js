var widget = {
    widget_name: "TestWidget",
    start: function () {
        uiw_setTitle(this.widget_name);
        uiw_setData("<b>Bold <i>Italic</i></b> text set via widget!");
    }
};