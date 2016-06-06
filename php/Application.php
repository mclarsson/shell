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
        '/api/get'     => 'getPosts',
        '/api/find'    => 'findPost',
        '/api/search'  => 'searchPosts',
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

    /**
     * Returns a set amount of the most recent posts.
     */
    private static function getPosts()
    {
        $from = isset($_GET['from']) ? $_GET['from'] : 0;
        $to   = isset($_GET['to']) ? $_GET['to'] : 30;
        $sql  = "SELECT * FROM posts ORDER BY created_at DESC, id DESC LIMIT ?, ?";

        DB::respond($sql, 'ii', [$from, $to]);
    }

    /**
     * Finds posts with matching title.
     */
    private static function findPost()
    {
        $title = isset($_GET['title']) ? $_GET['title'] : '';
        $id    = isset($_GET['id']) ? $_GET['id'] : -1;
        $sql   = "SELECT * FROM posts WHERE title = ? OR id = ?";

        DB::respond($sql, 'si', [$title, $id]);
    }
}
