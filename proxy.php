<?php
// Made by iTaysonLab, extended by YTKAB0BP
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$about = array(
    'proxyName' => 'iTaysonLab\'s Offical Proxy',
    'proxyContact' => '@wtfwatcher (Telegram)',
    'proxyAuthor' => 'iTaysonLab'
);

if (isset($_GET['method']) && $_GET['method'] === "proxyInfo") {
    die(json_encode($about));
}

$url = $_GET['url'];

function implodeItem(&$item, $key) {
    $item = $key . "=" . $item;
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);

    //echo "";
    return $length === 0 ||
        (substr($haystack, -$length) === $needle);
}

$allowed_urls = array(
    "m.vk.com", "vk.com", "api.vk.com", "oauth.vk.com", "login.vk.com"
);

$args = $_POST;
foreach ($allowed_urls as $u) {
    if (substr($url,0,8+strlen($u))==="https://".$u) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, "VKAndroidApp/4.13.1-1206 (Android 8.0.0; SDK 26; armeabi-v7a; Google Nexus 5; ru)");
        if (!endsWith($url,".png")) {
            curl_setopt($ch, CURLOPT_POST, 1);
            array_walk($args, "implodeItem");
            curl_setopt($ch, CURLOPT_POSTFIELDS, join('&',$args));
        }
        $out = curl_exec ($ch);
        $out = str_replace ('href="/', 'href="proxy.php?url=https%3A%2F%2F'.$u.'/', $out);
        $out = str_replace ('href="https://', 'href="proxy.php?url=https%3A%2F%2F', $out);
        $out = str_replace ('src="https://', 'src="proxy.php?url=https%3A%2F%2F', $out);
        $out = str_replace ('url(/', 'url(proxy.php?url=https%3A%2F%2F'.$u.'/', $out);
        $out = str_replace ('action="https://', 'action="proxy.php?url=https%3A%2F%2F', $out);
        $out = str_replace ('domain=.vk.com', 'domain=.'.$_SERVER['HTTP_HOST'], $out);
        curl_close($ch);
        if (endsWith($url,".css?196") || endsWith($url,".css?677")) {
            header("Content-Type: text/css; charset=UTF-8");
        }
        if (endsWith($url, ".png")) {
            header('Content-Type: image/png');
            header('Content-Length: '.strlen($out));
        }
        echo $out;
        return;
    }
}
die("Access denied");