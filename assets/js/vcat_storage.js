/** VCat LocalStorage Utils + some other utils **/
// Use my proxy. If set to false, project's root proxy is used.
var debug = true;

var theme = getItem('config_theme');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    theme = 'assets/themes/darkMaterial.css';
}
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
  $("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: themeName
  }).appendTo("head");
}

/****/

function setItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key);
}