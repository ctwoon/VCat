var theme = getItem('config_theme');
var themeName = getItem('config_theme_name');
if (!theme) {
    setItem('config_theme', 'assets/themes/darkMaterial.css');
    setItem('config_theme_name', 'Material Dark');
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