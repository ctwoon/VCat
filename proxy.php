<?php
header('Access-Control-Allow-Origin: *');
/**
 * Base proxy
 * For testing + for Ukrainian users
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$url = str_replace('"','',$_GET['url']);
echo file_get_contents($url);