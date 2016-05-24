<?php

/* CONFIG */

// HTML file with base resources
define('BASE_HTML', 'html/base_html.php');

// Environment 
// (removes index.php from this filepath)
$root = $_SERVER['PHP_SELF'];
$i = strpos($root, '/index.php');
$root = substr($root, 0, $i);
define('DOC_ROOT', $root);

// Database
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NAME', 'omega');

require_once '/php/Application.php';
require_once '/php/User.php';
require_once '/php/Database.php';

$uri = strtok($_SERVER["REQUEST_URI"], '?');
Application::route($uri);