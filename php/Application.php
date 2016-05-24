<?php

/**
 * Class handling the API
 */
class Application
{
    // Routes handled by php, these will not be available to angular.
    private static $routes = [
        '/api'         => 'api',
        '/auth/login'  => 'login',
        '/auth/logout' => 'logout',
    ];

    /**
     * Calls function associated with route, returns base html otherwise
     */
    public static function route($uri)
    {
        if (array_key_exists($uri, self::$routes)) {
            self::{self::$routes[$uri]}();
        } else {
            include BASE_HTML;
        }
    }

    private static function api()
    {
        echo $_GET['test'] . ', ' . $_GET['other'];
    }

    /**
     * Logs user in
     */
    private static function login()
    {
        if (empty($_POST['username']) || empty($_POST['password'])) {
            header('Location: /login');
        } else {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $user     = DB::query("SELECT * FROM users WHERE username = ?", 's', [$username])->fetch_object();
            User::login($user, $username, $password);
            header('Location: /');
        }
    }

    /**
     * Logs user out
     */
    private static function logout()
    {
        User::logout();
        echo header('Location: /');
        exit();
    }
}
