<?php
// Made by iTaysonLab, extended by YTKAB0BP
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$about = array(
    'proxyName' => 'VK Kitten proxy template',
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

$allowed_urls = array(
	"vk.com", "api.vk.com", "oauth.vk.com"
);

$args = $_POST;
foreach ($allowed_urls as $u) {
	if (substr($url,0,8+strlen($u))==="https://".$u) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		array_walk($args, "implodeItem");
		curl_setopt($ch, CURLOPT_POSTFIELDS, join('&',$args));
		$out = curl_exec ($ch);
		echo $out;
		curl_close($ch);
		return;
	}
}