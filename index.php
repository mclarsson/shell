<?php

/* CONFIG */

// HTML file with base resources
define('BASE_HTML', 'html/base_html.php');

// Environment 
// (removes index.php from this filepath)
define('DOC_ROOT', substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], '/index.php')));

// Database
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NAME', 'omega');

require_once '/php/Application.php';
require_once '/php/User.php';
require_once '/php/Database.php';
require_once '/php/Helpers.php';

$uri = strtok($_SERVER["REQUEST_URI"], '?');
Application::route($uri);