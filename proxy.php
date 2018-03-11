<?php
header('Access-Control-Allow-Origin: *');
/**
 * Base proxy
 * For testing + for Ukrainian users
 */
$about = array(
    'proxyName' => 'Offical VK Kitten Proxy',
    'proxyContact' => 'https://github.com/HardSer/VCat',
    'proxyAuthor' => 'iTaysonLab'
);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$urlStart = 'https://api.vk.com/method/';
switch ($_GET['method']) {
    case 'getNewsfeed':
        $urlEnd = 'newsfeed.get?access_token='.$_GET['token'].'&filters=post';
        break;
    case 'proxyInfo':
        echo json_encode($about);
        die();
        break;
    default:
        die();
        break;
}
echo file_get_contents($urlStart.$urlEnd);