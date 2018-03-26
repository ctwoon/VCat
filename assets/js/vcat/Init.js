// Use my proxy. If set to false, project's root proxy is used.
var debug = true;
// Show various debug messages in HTML (like sticker info)
var debugInfo = true;

logInfo("Main","Welcome to VCat 0.8.1!");

var theme = getItem('config_theme');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    theme = 'assets/themes/darkMaterial.css';
}
logInfo("ThemeEngine", "Loading theme "+theme);
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: themeName
    }).appendTo("head");
}

function craftURL(url) {
  if (!debug) {
      url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  } else {
      url = "http://vcatclient.000webhostapp.com/proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  }
  return url;
}
