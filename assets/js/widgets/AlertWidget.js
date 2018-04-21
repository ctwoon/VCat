var AlertWidget = {
    widget_codename: "alert",
    widget_name: "Уведомления",
    ads_timer: 0,
    ads_id: -1,
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, "<i>Загрузка...</i>");
        this.getAlert();
    },
    getAlert: function () {
        $.getJSON("libvcatmsg/currentAlert.json", function (json) {
            uiw_setData(AlertWidget.widget_codename, "<b>"+json['title']+"</b><br>"+json['body']+"<br><i>"+json['link']+"</i>");
        });
        this.initAdRotationInterval();
    },
    initAdRotationInterval: function() {
        $.getJSON("libvcatmsg/adsRotation.json", function (json) {
           AlertWidget.ads_timer = json['ads_rotation_interval'];
            setInterval(function () {
                AlertWidget.getAdvert();
            }, AlertWidget.ads_timer);
        });
    },
    getAdvert: function () {
        this.ads_id++;
        $.getJSON("libvcatmsg/adsRotation.json", function (json) {
            if (AlertWidget.ads_id > json['ads_item_count']) {
                AlertWidget.ads_id = 0;
            }
            uiw_setData(AlertWidget.widget_codename, "<b>"+json['ads_items'][AlertWidget.ads_id]['title']+"</b><br>"+json['ads_items'][AlertWidget.ads_id]['body']+"<br><i>"+json['ads_items'][AlertWidget.ads_id]['link']+" / Реклама</i>");
        });
    }
};

AlertWidget.init();