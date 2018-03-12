/** VCat LocalStorage Utils + some other utils **/
// Use my proxy. If set to false, project's root proxy is used.
var debug = true;

var theme = getItem('config_bg');
if (!theme) {
    setItem('config_bg', 'darkMaterial');
    bg = 'darkMaterial';
}
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
  $("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "assets/themes/"+themeName+".css"
  }).appendTo("head");
}

/**$.getJSON("assets/gradients.json", function(json) {
         var item = json[Math.floor(Math.random()*json.length)]; ('.dynamicBG').css('background', 'linear-gradient(to right, '+item['colors'][0]+', '+item['colors'][1]+')');
});**/

function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}