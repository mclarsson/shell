<?php

/**
 * Class handling the API
 */
class Application
{

    /**
     * Calls function associated with route, returns base html otherwise
     */
    public static function route($uri)
    {
        $trimmed = substr($uri, strlen(DOC_ROOT));
        if (array_key_exists($trimmed, self::$routes)) {
            self::{self::$routes[$trimmed]}();
        } else {
            include BASE_HTML;
        }
    }

    ///////////
    // _API_ //
    ///////////

    // Routes handled by php, these will not be available to angular.
    private static $routes = [
        '/api'         => 'api',
        '/auth/login'  => 'login',
        '/auth/logout' => 'logout',
    ];

    /**
     * Logs user in
     */
    private static function login()
    {
        if (empty($_POST['username']) || empty($_POST['password'])) {
            redirect('/login');
        } else {
            $username = $_POST['username'];
            $password = $_POST['password'];
            $user     = DB::query("SELECT * FROM users WHERE username = ?", 's', [$username])->fetch_object();
            User::login($user, $username, $password);
            redirect('/');
        }
    }

    /**
     * Logs user out
     */
    private static function logout()
    {
        User::logout();
        redirect('/');
        exit();
    }

    private static function api()
    {
        echo $_GET['test'] . ', ' . $_GET['other'];
    }
}
