// Show various debug messages in HTML (like sticker info)
var debugInfo = true;

logInfo("Main","Welcome to VCat 0.8.2!");

var theme = getItem('config_theme');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    theme = 'assets/themes/darkMaterial.css';
}

var offlineMode = getItem('app_offline');
if (!offlineMode) {
    setItem('app_offline', 'disabled');
    offlineMode = 'disabled';
    logInfo("Config", "Offline mode not set! Setting to disabled");
} else {
    logInfo("Config", "Offline mode is available - "+offlineMode);
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
  if (!useProxy) {
      url = "proxy.php?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  } else {
      url = proxyURL + "?url=" + encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
  }
  return url;
}
