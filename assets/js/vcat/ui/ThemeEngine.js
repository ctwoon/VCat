var theme = getItem('config_theme');
var themeName = getItem('config_theme_name');
var darkMode = getItem('app_darkmode');
if (!theme) {
    /*setItem('config_theme', 'assets/themes/darkMaterial.css');
    setItem('config_theme_name', 'Material Dark');
    theme = 'assets/themes/darkMaterial.css';*/
}
if (darkMode == "enabled") {
  themes_loadTheme('assets/themes/darkTheme.css');
} else {
  themes_loadTheme('assets/themes/defaultTheme.css');
}
logInfo("ThemeEngine", "Loading theme "+theme);
themes_loadTheme(theme);

function themes_loadTheme(themeName) {
  try {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: themeName
    }).appendTo("head");
  } catch (e) {

  }
}
