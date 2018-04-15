var ClockWidget = {
    widget_codename: "clock",
    widget_name: "Часы",
    init: function () {
        uiw_addWidgetBlock(this.widget_codename);
        uiw_setTitle(this.widget_codename, this.widget_name);
        uiw_setData(this.widget_codename, "");
        this.updateTime();
    },
    updateTime: function () {
        setInterval(function () {
            var d = new Date();
            var days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
            var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
            var currentYear = d.getFullYear();
            var currentMonth = months[d.getMonth()];
            var currentDay = days[d.getDay()];
            var currentHours = d.getHours();
            var currentMinutes = d.getMinutes();
            var currentSeconds = d.getSeconds();
            var currentDayDigit = d.getDate();
            if (currentHours.toString().length == 1) {
                currentHours = "0" + currentHours;
            }
            if (currentMinutes.toString().length == 1) {
                currentMinutes = "0" + currentMinutes;
            }
            if (currentSeconds.toString().length == 1) {
                currentSeconds = "0" + currentSeconds;
            }
            uiw_setData('clock', currentDay + ", " + currentDayDigit + " " + currentMonth + " " + currentYear + "<br>" + currentHours + ":" + currentMinutes + ":" + currentSeconds);
        }, 1000);
    }
};

ClockWidget.init();