var theme = getItem('config_theme');
var themeName = getItem('config_theme_name');

var blurMode = getItem('app_blur');
var backgroundPhotoPicture = getItem('app_background_photo');

var darkMode = getItem('app_darkmode');
if (!theme) {
    setItem('config_theme', 'assets/themes/defaultTheme.css');
    setItem('config_theme_name', 'VK Style');
    theme = 'assets/themes/defaultTheme.css';
}

if (!blurMode) {
    setItem('app_blur', 'disabled');
    blurMode = 'disabled';
}

if (!backgroundPhotoPicture) {
    setItem('app_background_photo', 'disabled');
    backgroundPhotoPicture = 'disabled';
}

themes_loadTheme(theme);

if (blurMode == "enabled") {
  themes_loadTheme("assets/css/blur.css");
}

if (backgroundPhotoPicture != "disabled") {
  themes_loadTheme("assets/css/bgphoto-help.css");
  $("body").css("background", "url('"+backgroundPhotoPicture+"')");
}

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
