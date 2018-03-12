$(".configBackground").click(function() {
   var bg = getItem('config_bg');
   if (bg == 0) {
       setItem('config_bg', 1);
       $(".configBackgroundSummary").html("Случайный градиент | [Картинка]");
   }
   if (bg == 1) {
       setItem('config_bg', 0);
       $(".configBackgroundSummary").html("[Случайный градиент] | Картинка");
   }
});